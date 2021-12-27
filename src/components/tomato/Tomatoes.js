import React from "react";

class TomatoesPage extends React.Component {
  state = {
    tomato: {
      description: "desc",
    },
  };

  handleChange = (event) => {
    const tomato = { ...this.state.tomato, description: event.target.value };
    this.setState({ tomato: tomato });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    alert(this.state.tomato.description);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Tomatoes</h2>
        <h3>Save Tomato</h3>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.tomato.description}
        ></input>

        <input type="submit" value="Save"></input>
      </form>
    );
  }
}

export default TomatoesPage;
