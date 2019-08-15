const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Promise = require("promise");

const Profile = require("./Profile");
const MusicGenre = require("./MusicGenre");
const UserMusicGenre = require("./UserMusicGenre");
const UserArtType = require("./UserArtType");
const UserArtPractic = require("./UserArtPractic");

const Post = require("./Post");

const ArtType = require("./ArtType");
// const SubArtType = require("./SubArtType");
const ArtPractic = require("./ArtPractic");

class User extends Sequelize.Model {
  static associate(models) {}

  // someMethod() {}
  static getAllUserInfo(userId) {
    return new Promise(function(resolve, reject) {
      const user = User.findOne({
        where: { id: userId },
        include: [
          {
            model: Profile,
            attributes: ["location", "description", "social"],
            as: "profile"
          },
          {
            model: UserMusicGenre,
            attributes: ["music_genre_id"],
            as: "music_genres",
            include: {
              model: MusicGenre,
              as: "music_genre_details",
              attributes: ["music_genre_name", "id"]
            }
          },
          {
            model: UserArtType,
            as: "art_types",
            attributes: ["art_type_id"],
            include: [
              {
                model: ArtType,
                as: "art_type_details",
                attributes: ["art_type_name", "id"]
              },
              {
                model: UserArtPractic,
                as: "art_practics",
                attributes: ["is_active"],
                include: {
                  model: ArtPractic,
                  as: "art_practic_details",
                  attributes: ["art_practic_name", "id"]
                }
              }
              // {
              //   model: UserSubArtType,
              //   as: "sub_art_types",
              //   attributes: ["is_active"],
              //   include: {
              //     model: SubArtType,
              //     as: "sub_art_type_details",
              //     attributes: ["sub_art_type_name", "id"]
              //   }
              // }
            ]
          }
        ]
      });
      user.then(user => {
        User.getUserScoreByUserId(user.id).then(userScore => {
          user.dataValues.user_score = userScore;
          resolve(user);
        });
      });
    });
  }

  static getListOfAllUsers() {
    return new Promise(function(resolve, reject) {
      // return User.findAll({
      const users = User.findAll({
        include: [
          // {
          //   model: UserArtType,
          //   as: "art_types",
          //   attributes: ["art_type_id"],
          //   include: [
          //     {
          //       model: ArtType,
          //       as: "art_type_details",
          //       attributes: ["art_type_name", "id"]
          //     }
          //   ]
          // }
          {
            model: UserArtPractic,
            as: "art_practics",
            attributes: ["is_active"],
            where: { is_active: true },
            include: {
              model: ArtPractic,
              as: "art_practic_details",
              attributes: ["art_practic_name", "id"]
            }
          }
        ],
        attributes: ["name", "avatar", "id"]
      }).filter(user => user.art_practics[0]);
      // add user score to every user
      users.then(users =>
        users.map((user, index) => {
          User.getUserScoreByUserId(user.dataValues.id)
            .then(userScore => {
              user.dataValues.user_score = userScore;
              if (!users[index + 1]) {
                resolve(users);
              }
            })
            .catch(err => console.log(err));
        })
      );
    });
  }

  static getUserScoreByUserId(userId) {
    return new Promise(function(resolve, reject) {
      Post.getPostsByUserId(userId).then(posts => {
        var userScore = 0;
        posts.forEach(function(post) {
          var postScore = 0;
          post.likes.forEach(function(like) {
            postScore += like.like_score;
          });
          post.dislikes.forEach(function(dislike) {
            postScore -= dislike.dislike_score;
          });
          if (postScore > 50) {
            userScore += postScore / 100;
          }
        });
        resolve(userScore);
      });
    });
  }
}

User.init(
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    avatar: Sequelize.STRING,
    avatar_key: Sequelize.STRING
  },
  { sequelize, modelName: "User" }
);

User.hasOne(Profile, { foreignKey: "user_id", as: "profile" });
User.hasMany(UserArtType, { foreignKey: "user_id", as: "art_types" });
User.hasMany(UserMusicGenre, { foreignKey: "user_id", as: "music_genres" });
User.hasMany(UserArtPractic, { foreignKey: "user_id", as: "art_practics" });

module.exports = User;
