import "./index.scss";
import {
  TextControl,
  Flex,
  FlexBlock,
  FlexItem,
  Button,
  Icon,
  PanelBody,
  PanelRow,
  ColorPicker,
} from "@wordpress/components";
import {
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from "@wordpress/block-editor";

function ourStartFunction() {
  let locked = false;
  wp.data.subscribe(() => {
    const results = wp.data
      .select("core/block-editor")
      .getBlocks()
      .filter((block) => {
        return (
          block.name == "multiplechoice/multiple-choice" &&
          block.attributes.correctAnswer == undefined
        );
      });
    if (results.length && locked == false) {
      locked = true;
      wp.data.dispatch("core/editor").lockPostSaving("noanswer");
    }

    if (!results.length && locked) {
      locked = false;
      wp.data.dispatch("core/editor").unlockPostSaving("noanswer");
    }
  });
}

ourStartFunction();

wp.blocks.registerBlockType("multiplechoice/multiple-choice", {
  title: "Multiple Choice",
  icon: "smiley",
  category: "common",
  attributes: {
    question: { type: "string" },
    answers: { type: "array", default: [""] },
    correctAnswer: { type: "number", default: undefined },
    bgColor: { type: "string", default: "#EBEBEB" },
    theAlignment: { type: "string", default: "left" },
  },
  description: "GIve your audience a chance to prove their comprehension",
  example: {
    attributes: {
      question: "What is my name?",
      correctAnswer: 3,
      answers: ["Meowsalot", "Barksalot", "Purrsloud", "Deepak"],
      theAlignment: "center",
      bgColor: "#CFE8F1",
    },
  },
  edit: function (props) {
    function updateQuestion(value) {
      props.setAttributes({ question: value });
    }

    function deleteAnswer(indexToDelete) {
      const newAnswers = props.attributes.answers.filter((x, index) => {
        return index != indexToDelete;
      });
      props.setAttributes({ answers: newAnswers });

      if (indexToDelete == props.attributes.correctAnswer) {
        props.setAttributes({ correctAnswer: undefined });
      }
    }

    function markAsCorrect(index) {
      props.setAttributes({ correctAnswer: index });
    }

    return (
      <div
        className='paying-attention-edit-block'
        style={{ backgroundColor: props.attributes.bgColor }}
      >
        <BlockControls>
          <AlignmentToolbar
            value={props.attributes.theAlignment}
            onChange={(x) => props.setAttributes({ theAlignment: x })}
          />
        </BlockControls>
        <InspectorControls>
          <PanelBody title='Background Color' initialOpen={true}>
            <PanelRow>
              <ColorPicker
                color={props.attributes.bgColor}
                onChangeComplete={(x) =>
                  props.setAttributes({ bgColor: x.hex })
                }
              />
            </PanelRow>
          </PanelBody>
        </InspectorControls>
        <TextControl
          label='Question:'
          value={props.attributes.question}
          onChange={updateQuestion}
          style={{ fontSize: "20px" }}
        />
        <p style={{ fontSize: "13px", margin: "20px 0 8px 0" }}>Answers:</p>
        {props.attributes.answers.map((answer, index) => {
          return (
            <Flex>
              <FlexBlock>
                <TextControl
                  value={answer}
                  onChange={(newValue) => {
                    const newAnswers = props.attributes.answers.concat([]);
                    newAnswers[index] = newValue;
                    props.setAttributes({ answers: newAnswers });
                  }}
                />
              </FlexBlock>
              <FlexItem>
                <Button onClick={() => markAsCorrect(index)}>
                  <Icon
                    className='mark-as-correct'
                    icon={
                      props.attributes.correctAnswer == index
                        ? "star-filled"
                        : "star-empty"
                    }
                  />
                </Button>
              </FlexItem>
              <FlexItem>
                <Button
                  onClick={() => deleteAnswer(index)}
                  isLink
                  className='attention-delete'
                >
                  Delete
                </Button>
              </FlexItem>
            </Flex>
          );
        })}
        <Button
          isPrimary
          onClick={() => {
            props.setAttributes({
              answers: props.attributes.answers.concat([""]),
            });
          }}
        >
          Add Another Answer
        </Button>
      </div>
    );
  },
  save: function (props) {
    return null;
  },
});
