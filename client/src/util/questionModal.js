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
import Spinner from "./spinner";
import { gql } from 'apollo-boost';
import { Mutation } from "react-apollo";
import ReactQuill from 'react-quill';
import {Redirect} from "react-router-dom";

const styles = theme => ({
    paper: {
        margin: 'auto',
        position: 'relative',
        top: '50%',
        transform: 'translate(0%, -50%)',
        width: '80%',
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
    },
    scroll: {
        maxHeight: "80vh",
        overflow: "scroll"
    }
});

const editorTheme = {border:"1px solid #3f51b5",borderRadius:"2px"};

class QuestionModel extends React.Component {
    state = {
        activeStep: 0,
        skipped: new Set(),
        question: "",
        styles : editorTheme,
        editorHtml: "",
        postFlag: false
    };

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['code-block', 'link', 'image', 'video']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    };

    formats = [
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'code-block', 'link', 'image', 'video'
    ];

    handleChange = (html) => {
        this.setState({ editorHtml: html });
    };

    handleQuestionChange = (event) => {
        this.setState({question: event.target.value});
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
                        onChange={this.handleQuestionChange}
                        margin="normal"
                        autoFocus={true}
                        autoComplete={"off"}
                        placeholder={"Enter Your Question"}
                    />
                );
            case 1:
                return (
                    <div id="quill" style={this.state.styles}>
                        <ReactQuill
                            theme={"snow"}
                            onChange={this.handleChange}
                            value={this.state.editorHtml}
                            modules={this.modules}
                            formats={this.formats}
                            bounds={'.app'}
                            placeholder={"Enter the text here..."}
                        />
                    </div>
                );
            case 2:
                return (<div><Typography  variant="h6" component="h2" children={this.state.question} gutterBottom />
                    {!this.state.skipped.has(1) && <div className={"ql-snow"}><div className={"ql-editor"} dangerouslySetInnerHTML={{__html: this.state.editorHtml}}/></div>}
                </div>);
            default:
                return 'Unknown step';
        }
    };

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
                <Stepper className={classes.scroll} activeStep={activeStep} orientation="vertical">
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
                            <Mutation mutation={gql`
                                mutation CreatePost($postInput: PostInput!) {
                                    createPost(data: $postInput) {
                                        id
                                    }
                                }
                            `}>{(createPost, { loading, error, data }) => {
                                if (loading) return <Spinner />;
                                if (data){ console.log("success data-",data);return <div>{data.createPost.id}</div>;}
                                if (error) return `Error!: ${error}`;
                                const desc = !this.state.skipped.has(1) ?
                                    "<div class='ql-snow'><div class='ql-editor'>" + this.state.editorHtml + "</div></div>" :
                                    null;
                                console.log("in mutation caller");
                                    createPost({
                                        variables: {
                                            postInput: {
                                                heading: this.state.question,
                                                description: desc,
                                                userId: this.props.userInfo.id
                                            }
                                        }
                                    });
                                return <div>Uploading</div>
                            }}
                            </Mutation>
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
