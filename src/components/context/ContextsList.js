import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ContextsList = ({ contexts }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Label</th>
        </tr>
      </thead>
      <tbody>
        {contexts.map((ctx) => {
          return (
            <tr key={ctx.label}>
              <td>
                <Link to={"/contexts/" + ctx.tomatoContextId}>{ctx.label}</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

ContextsList.propTypes = {
  contexts: PropTypes.array.isRequired,
};

export default ContextsList;
