import React, { Component } from 'react';
import PropTypes from 'prop-types';
import constants from './constants';

const { unitTempSymbols } = constants;

class TemperatureUnitSelector extends Component {

  handleOnChange(value) {
    if (value && value !== this.props.selectedUnit) {
      this.props.onUnitSelected(value);
    }
  }

  render() {
    return (
      <div>
        <form>
          <div>Temperature Units:</div>
          {Object.keys(unitTempSymbols).map(value => (
            <div key={value}>
              <label htmlFor={`radio-${value}`}>
                <input
                  id={`radio-${value}`}
                  type="radio"
                  value={value}
                  checked={value === this.props.selectedUnit}
                  onChange={e => this.handleOnChange(e.target.value)}
                />
                {`${unitTempSymbols[value]} (${value})`}
              </label>
            </div>
          ))}
        </form>
      </div>
    );
  }
}

TemperatureUnitSelector.defaultProps = {
  selectedUnit: null,
};

TemperatureUnitSelector.propTypes = {
  selectedUnit: PropTypes.string,
  onUnitSelected: PropTypes.func.isRequired,
};

export default TemperatureUnitSelector;
