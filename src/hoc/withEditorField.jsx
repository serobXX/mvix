import { makeStyles } from '@material-ui/core'
import Container from 'components/containers/Container'
import { statusValues } from 'constants/commonOptions'
import React, {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { _get } from 'utils/lodash'
import { camelCaseToSplitCapitalize } from 'utils/stringConversion'

const KEY_BACKSPACE = 'Backspace'
const KEY_F2 = 'F2'
const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'
const KEY_ARROW_LEFT = 'ArrowLeft'
const KEY_ARROW_RIGHT = 'ArrowRight'

const useStyles = makeStyles(({ spacing }) => ({
  multiRoot: {
    padding: `0px ${spacing(2)}px`
  }
}))

const withEditorField = (Component, editors, cellEditorProps) =>
  forwardRef(
    (
      { eventKey, colDef: { field }, value: defaultValue, stopEditing, data },
      ref
    ) => {
      const classes = useStyles()
      const isMultiEditor = !Component && !!editors?.length

      const createInitialState = () => {
        let startValue
        let highlightAllOnFocus = true

        if (eventKey === KEY_BACKSPACE) {
          // if backspace or delete pressed, we clear the cell
          startValue = ''
        } else {
          // otherwise we start with the current value
          startValue = isMultiEditor
            ? editors.reduce((a, b) => {
                a[b.field] = data[b.field]
                return a
              }, {})
            : defaultValue || data[field]
          if (eventKey === KEY_F2) {
            highlightAllOnFocus = false
          }
        }

        return {
          value: startValue,
          highlightAllOnFocus
        }
      }

      const initialState = createInitialState()
      const [editorData, setEditorData] = useState(initialState.value)
      const [highlightAllOnFocus, setHighlightAllOnFocus] = useState(
        initialState.highlightAllOnFocus
      )
      const refInput = useRef(null)

      // focus on the input
      useEffect(() => {
        // get ref from React component
        const eInput = refInput.current
        if (eInput) {
          eInput.focus()
          if (highlightAllOnFocus) {
            eInput.select()

            setHighlightAllOnFocus(false)
          } else {
            const length = eInput.value ? eInput.value.length : 0
            if (length > 0) {
              eInput.setSelectionRange(length, length)
            }
          }
        }
        //eslint-disable-next-line
      }, [])

      useEffect(() => {
        if (data.status === statusValues.disabled) {
          stopEditing()
        }
        //eslint-disable-next-line
      }, [data.status])

      /* Utility Methods */
      const isLeftOrRight = event => {
        return [KEY_ARROW_LEFT, KEY_ARROW_RIGHT].indexOf(event.key) > -1
      }

      const isBackspace = event => {
        return event.key === KEY_BACKSPACE
      }

      const finishedEditingPressed = event => {
        const key = event.key
        return key === KEY_ENTER || key === KEY_TAB
      }

      const handleKeyDown = event => {
        if (isLeftOrRight(event) || isBackspace(event)) {
          event.stopPropagation()
          return
        }
        if (finishedEditingPressed(event)) {
          if (event.preventDefault) event.preventDefault()

          stopEditing()
        }
      }

      const handleChange =
        (isInput, convertToString) =>
        async ({ target: { name, value } }) => {
          const editorText = isMultiEditor
            ? {
                ...(editorData || {}),
                [name]: value
              }
            : value
            ? convertToString
              ? String(value)
              : value
            : value
          await setEditorData(editorText)
          if (isInput === false) {
            stopEditing()
          }
        }

      // /* Component Editor Lifecycle methods */
      useImperativeHandle(ref, () => {
        return {
          getValue() {
            return editorData
          }
        }
      })

      const renderEditor = useCallback(
        ({
          placeholder,
          name,
          value,
          cellEditorProps: {
            isInput,
            isMultiSelection,
            convertToString,
            ...cellEditorProps
          } = {},
          component: Component,
          refInput,
          handleChange,
          handleKeyDown
        }) => (
          <Component
            inputRef={refInput}
            name={name}
            {...(isMultiSelection ? { values: value } : { value })}
            onChange={handleChange(isInput, convertToString)}
            onKeyDown={handleKeyDown}
            marginBottom={false}
            placeholder={placeholder}
            fullHeight
            fullWidth
            {...cellEditorProps}
          />
        ),
        []
      )

      return data.status === statusValues.disabled ? null : isMultiEditor ? (
        <Container cols={editors.length} rootClassName={classes.multiRoot}>
          {editors.map((editor, index) => (
            <Fragment key={`multiple-editors-${editor.field}`}>
              {renderEditor({
                placeholder: _get(
                  editor,
                  'headerName',
                  camelCaseToSplitCapitalize(_get(editor, 'field', ''))
                ),
                name: editor.field,
                value: editorData?.[editor.field],
                cellEditorProps:
                  typeof editor.cellEditorProps === 'function'
                    ? editor.cellEditorProps(data)
                    : editor.cellEditorProps,
                component: editor.cellEditor,
                refInput: index === 0 && refInput,
                handleChange,
                handleKeyDown
              })}
            </Fragment>
          ))}
        </Container>
      ) : (
        renderEditor({
          name: 'editor',
          value: editorData,
          cellEditorProps:
            typeof cellEditorProps === 'function'
              ? cellEditorProps(data)
              : cellEditorProps,
          component: Component,
          refInput: refInput,
          handleChange,
          handleKeyDown
        })
      )
    }
  )

export default withEditorField
