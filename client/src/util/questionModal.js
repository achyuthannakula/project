import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

const styles = theme => ({
    paper: {
        margin: 'auto',
        position: 'relative',
        top: '50%',
        transform: 'translate(0%, -50%)',
        width: '70%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    }
});

const editorTheme = {border:"1px solid #3f51b5",borderRadius:"2px"};

class QuestionModel extends React.Component {
    state = {
        activeStep: 0,
        skipped: new Set(),
        question: "Test",
        description: "aac",
        styles : editorTheme
    };

    getSteps = () => {
        return ['Enter Your Question', 'Any Description', 'Validate/Submit'];
    };

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <TextField
                        id="question"
                        label="Question"
                        value={this.state.question}
                        onChange={this.handleChange('question')}
                        margin="normal"
                    />
                );
            case 1:
                return (
                    <div style={this.state.styles}>
                    <CKEditor
                        editor={ InlineEditor }
                        data={this.state.description || ''}
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( this.state.description+'---Editor is ready to use!', editor );
                        } }
                        //"heading" , "|" , "bold", "italic", "link", "bulletedList" ,"numberedList", "imageUpload" ,"blockQuote", "insertTable", "mediaEmbed" , "undo" ,"redo"
                        config={{toolbar: [ "bold", "italic", "link", "bulletedList","numberedList", "undo" ,"redo"]}}
                        onChange={ ( event, editor ) => {
                            this.state.description = editor.getData();
                            //console.log( event, "----"+t  his.state.description);
                        } }
                        onBlur={ editor => {
                            this.setState({styles: editorTheme});
                        } }
                        onFocus={ editor => {
                            this.setState({styles: null});
                        } }
                        disabled={false}
                    />
                    </div>
                );
            case 2:
                return (<div><Typography  variant="h6" component="h2" children={this.state.question} gutterBottom />
                    <div dangerouslySetInnerHTML={{__html: this.state.description}}/></div>);
            default:
                return 'Unknown step';
        }
    };

    handleChange = index => event => this.setState({[index]: event.target.value});
    isStepOptional = step => step === 1;

    handleNext = () => {
        const { activeStep } = this.state;
        let { skipped } = this.state;
        if (this.isStepSkipped(activeStep)) {
            skipped = new Set(skipped.values());
            skipped.delete(activeStep);
        }
        this.setState({
            activeStep: activeStep + 1,
            skipped,
        });
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleSkip = () => {
        const { activeStep } = this.state;
        if (!this.isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        this.setState(state => {
            const skipped = new Set(state.skipped.values());
            skipped.add(activeStep);
            return {
                activeStep: state.activeStep + 1,
                skipped,
            };
        });
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    isStepSkipped(step) {
        return this.state.skipped.has(step);
    }

    render() {
        const { classes } = this.props;
        const steps = this.getSteps();
        const { activeStep } = this.state;

        return (
            <div className={classes.paper}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => {
                        const props = {};
                        const labelProps = {};
                        if (this.isStepOptional(index)) {
                            labelProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (this.isStepSkipped(index)) {
                            props.completed = false;
                        }
                        return (
                            <Step key={label} {...props}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                                <StepContent>
                                    {this.getStepContent(index)}
                                    <div className={classes.actionsContainer}>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={this.handleBack}
                                                className={classes.button}
                                            >
                                                Back
                                            </Button>
                                            {this.isStepOptional(activeStep) && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleSkip}
                                                    className={classes.button}
                                                >
                                                    Skip
                                                </Button>
                                            )}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
                                                className={classes.button}
                                            >
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                <div>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} className={classes.resetContainer}>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={this.handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </Paper>
                    )}
                </div>
            </div>
        );
    }
}

QuestionModel.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(QuestionModel);