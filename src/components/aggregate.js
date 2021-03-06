import React from 'react';
import '@dhis2/d2-ui-core/css/Table.css';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {inject, observer} from "mobx-react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Typography from "@material-ui/core/Typography";
import D0 from "./aggregate/d0";
import D1 from "./aggregate/d1";
import D2 from "./aggregate/d2";
import D3 from "./aggregate/d3";
import D4 from "./aggregate/d4";
import D5 from "./aggregate/d5";
import D6 from "./aggregate/d6";


const styles = theme => ({
    card: {
        margin: '5px'
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    space: {
        marginLeft: '5px;'
    },
    table: {
        width: '100%',
    },
    hidden: {
        display: 'none'
    },
    block: {
        display: 'block'
    }
});

@inject('IntegrationStore')
@observer
class Aggregate extends React.Component {
    integrationStore = null;

    constructor(props) {
        super(props);
        const {d2, IntegrationStore} = props;
        this.integrationStore = IntegrationStore;
        this.integrationStore.setD2(d2);
    }

    getStepContent = step => {
        switch (step) {
            case 0:
                return <D0/>;
            case 1:
                return <D1/>;
            case 2:
                return <D2/>;
            case 3:
                return <D3/>;
            case 4:
                return <D4/>;
            case 5:
                return <D5/>;
            case 6:
                return <D6/>;
            default:
                return 'Unknown step';
        }
    };

    render() {

        const {classes, baseUrl} = this.props;
        let finish = '';
        if (this.integrationStore.dataSet &&
            (this.integrationStore.dataSet.percentage === 0 ||
                this.integrationStore.dataSet.percentage === 100)) {
            finish = <Button
                variant="contained"
                color={this.integrationStore.finishLabel === 'Finish' ? 'primary' : 'secondary'}
                href={baseUrl}
                className={this.integrationStore.activeAggregateStep < 5 ? classes.hidden : classes.button}
            >
                {this.integrationStore.finishAggregateLabel}
            </Button>
        }
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Stepper alternativeLabel activeStep={this.integrationStore.activeAggregateStep}>
                            {this.integrationStore.aggregateSteps.map((label, index) => {
                                const props = {};
                                const buttonProps = {};

                                return (
                                    <Step key={label} {...props}>
                                        <StepButton
                                            onClick={this.integrationStore.handleAggregateStep(index)}
                                            completed={this.integrationStore.isAggregateStepComplete(index)}
                                            {...buttonProps}
                                        >
                                            {label}
                                        </StepButton>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        <div>
                            {this.integrationStore.allAggregateStepsCompleted() ? (
                                <div>
                                    <Typography className={classes.instructions}>
                                        All steps completed - you&quot;re finished
                                    </Typography>
                                    <Button onClick={this.handleResetAggregate}>Reset</Button>
                                </div>
                            ) : (
                                <div>
                                    <div
                                        className={classes.instructions}>{this.getStepContent(this.integrationStore.activeAggregateStep)}</div>
                                    <table width="100%">
                                        <tbody>
                                        <tr>
                                            <td width="33%" align="left">
                                                <Button
                                                    disabled={this.integrationStore.activeAggregateStep === 0}
                                                    onClick={this.integrationStore.handleAggregateBack}
                                                    variant="contained"
                                                    color="secondary"
                                                    className={this.integrationStore.activeAggregateStep === 0 || this.integrationStore.activeAggregateStep === 6 ? classes.hidden : classes.button}
                                                >
                                                    Back
                                                </Button>
                                            </td>
                                            <td width="34%" valign="top" align="center">
                                                <Button
                                                    disabled={this.integrationStore.activeAggregateStep === 0}
                                                    onClick={this.integrationStore.saveAggregate}
                                                    variant="contained"
                                                    color="default"
                                                    className={this.integrationStore.activeAggregateStep < 2 ? classes.hidden : classes.button}
                                                >
                                                    Save
                                                </Button>
                                            </td>
                                            <td width="33%" valign="top" align="right">
                                                <Button
                                                    disabled={this.integrationStore.disableNextAggregate}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.integrationStore.handleNextAggregate}>
                                                    {this.integrationStore.nextAggregateLabel}
                                                </Button>
                                                {finish}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Aggregate.propTypes = {
    d2: PropTypes.object.isRequired,
    classes: PropTypes.object,
};

export default withStyles(styles)(Aggregate);
