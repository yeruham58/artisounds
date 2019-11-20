import React from "react";
import { Link } from "react-router-dom";

const CreateProjectButton = () => {
  return (
    <div className="btn-group mb-4" role="group">
      <Link to="create-project" className="btn btn-light">
        <i className="fas fa-sliders-h text-info mr-1" />
        Create New Project
      </Link>
    </div>
  );
};

export default CreateProjectButton;
