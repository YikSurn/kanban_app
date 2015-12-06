import React from 'react';
import Lane from './Lane.jsx';

export default class Lanes extends React.Component {
  render() {
    const lanes = this.props.items;

    return (
      <div className="lanes">
        {lanes.map(this.renderLane)}
      </div>
    );
  }
  renderLane(lane) {
    // return (
    //   <Lane className="lane" key={lane.id} >
    //     <Lane.Header id={lane.id} name={lane.name} />
    //     <Lane.Notes id={lane.id} name={lane.notes} />
    //   </Lane>
    // );
    return (
      <Lane className="lane" key={lane.id} lane={lane} />
    );
  }
}
