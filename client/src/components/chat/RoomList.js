import React, { Component } from "react";

import { splitNameAndId } from "../../config/chatConfig";

class RoomList extends Component {
  render() {
    const orderedRooms = [...this.props.rooms].sort(
      (a, b) => Date.parse(b.lastMessageAt) - Date.parse(a.lastMessageAt)
    );
    return (
      <div>
        <h3>Contacts:</h3>
        <hr align="left" width="100%" className="mb-0" />

        {orderedRooms.map(room => {
          const memberName = room.name
            .split(":")
            .find(
              name => name.indexOf(this.props.user.name + splitNameAndId) < 0
            )
            .split(splitNameAndId)[0];
          const active = room.id === this.props.roomId ? "active" : "";
          return (
            <div className="container pr-0" key={room.id}>
              <div
                className={`row room ${active}`}
                onClick={() => {
                  room.unreadCount = 0;
                  this.props.subscribeToRoom(
                    room.id,
                    room.name
                      .split(":")
                      .find(
                        name =>
                          name.indexOf(this.props.user.name + splitNameAndId) <
                          0
                      )
                  );
                }}
              >
                <div className="col-1">
                  <img
                    className="rounded-circle mr-1 mt-2 mb-2"
                    src={
                      room.customData.imgUrls.find(
                        nemeAndUrl =>
                          Object.keys(nemeAndUrl).indexOf(memberName) > -1
                      )[memberName]
                    }
                    alt=""
                    style={{
                      width: "30px",
                      height: "30px"
                    }}
                  />
                </div>
                <div className="col-10 mt-2">
                  <strong className="ml-2">{memberName}</strong>
                  {room.unreadCount > 0 && room.id !== this.props.roomId ? (
                    <strong className="unreadMessagesNumber ml-2">
                      {room.unreadCount}
                    </strong>
                  ) : null}
                </div>
                <hr align="left" width="100%" className="mb-0 mt-0" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default RoomList;
