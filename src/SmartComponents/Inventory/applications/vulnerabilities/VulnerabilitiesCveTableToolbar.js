import React, { Component } from 'react';
import { Checkbox, Form, FormGroup, Select, SelectOption, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import { routerParams, SimpleTableFilter } from '../../../../';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';

const CVSSOptions = [
    { value: 'all', label: 'All', disabled: false, from: '', to: '' },
    { value: '0to3', label: 'Lower than 3', disabled: false, from: '', to: 3 },
    { value: '3to7', label: '3 - 7', disabled: false, from: 3, to: 7 },
    { value: '7to10', label: '7 - 10', disabled: false, from: 7, to: 10 }
];

class VulnerabilitiesCveTableToolbar extends Component {
    state = {
        defaultConfig: {
            filter: '',
            // eslint-disable-next-line camelcase
            cvss_score: 'all',
            // eslint-disable-next-line camelcase
            show_all: 'False'
        },
        toolbarConfig: {}
    }
    changeFilterValue = debounce(value => this.setState(
        {
            toolbarConfig: { ...this.state.toolbarConfig, filter: value }
        },
        this.apply
    ), 400);

    apply = () => this.props.apply(this.state.toolbarConfig);

    changeCVSSValue = (value, options) => {
        const target = options.find(item => item.value === value);
        // eslint-disable-next-line camelcase
        this.setState({ toolbarConfig: { ...this.state.toolbarConfig, cvss_from: target.from, cvss_to: target.to }}, this.apply);
    }

    changeCheckboxValue = (value) => {
        // eslint-disable-next-line camelcase
        this.setState({ toolbarConfig: { ...this.state.toolbarConfig, show_all: !value }}, this.apply);
    }

    getCVSSValue = (options) => {
        const option = options.find(
            // eslint-disable-next-line camelcase
            item => item.from === this.state.toolbarConfig.cvss_from && item.to === this.state.toolbarConfig.cvss_to
        );
        return option ? option.value : options[0].value;
    }

    render() {
        const { showAllCheckbox, downloadReport, totalNumber } = this.props;

        return (
            <React.Fragment>
                <Toolbar className="cvetable-toolbar ">
                    <ToolbarGroup className="filterCVES space-between-toolbar-items">
                        <ToolbarItem>
                            <SimpleTableFilter onFilterChange={ (value) => this.changeFilterValue(value) } onButtonClick={ this.apply } />
                        </ToolbarItem>
                        <ToolbarItem>
                            <Form>
                                <FormGroup label="CVSS Base Score" fieldId="cvssScore">
                                    <Select
                                        id="cvssScore"
                                        onChange={ value => this.changeCVSSValue(value, CVSSOptions) }
                                        value={ this.getCVSSValue(CVSSOptions) }
                                    >
                                        { CVSSOptions.map((option, index) => (
                                            <SelectOption
                                                isDisabled={ option.disabled }
                                                key={ index }
                                                value={ option.value }
                                                label={ option.label }
                                            />
                                        )) }
                                    </Select>
                                </FormGroup>
                            </Form>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            { showAllCheckbox && (
                                <React.Fragment>
                                    <br />
                                    <Checkbox
                                        label="Hide CVEs that do not affect my inventory"
                                        isChecked={ !this.state.toolbarConfig.show_all }
                                        onChange={ state => this.changeCheckboxValue(state) }
                                        aria-label="controlled checkbox example"
                                        id="check-1"
                                    />
                                </React.Fragment>
                            ) }
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup className="space-between-toolbar-items">
                        <ToolbarItem>
                            <DownloadIcon id="download-report" size="lg" onClick={ downloadReport } />
                        </ToolbarItem>
                        <ToolbarItem>
                            <div className="number-of-results">{ totalNumber }</div>
                            Results
                        </ToolbarItem>
                    </ToolbarGroup>
                </Toolbar>
            </React.Fragment>
        );
    }
}

VulnerabilitiesCveTableToolbar.propTypes = {
    CVETable: propTypes.any,
    apply: propTypes.func,
    showAllCheckbox: propTypes.bool,
    totalNumber: propTypes.number,
    downloadReport: propTypes.func
};

VulnerabilitiesCveTableToolbar.defaultProps = {
    showAllCheckbox: false,
    totalNumber: 0,
    apply: () => undefined,
    downloadReport: () => undefined
};

export default routerParams(VulnerabilitiesCveTableToolbar);