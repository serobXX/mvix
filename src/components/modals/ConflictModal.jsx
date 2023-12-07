import { useFormik } from 'formik'
import { makeStyles } from '@material-ui/core'

import { DefaultModal } from 'components/modals'
import Scrollbars from 'components/Scrollbars'
import AccordionRow from './ConvertConflictModal/AccordionRow'
import { useEffect } from 'react'

const useStyles = makeStyles(() => ({
  modalContent: {
    paddingTop: 16
  }
}))

const ConflictModal = ({
  open,
  title,
  onSubmit,
  onClose,
  data,
  values: valuesFromParent
}) => {
  const classes = useStyles()
  const { values, handleChange, handleSubmit, setValues } = useFormik({
    initialValues: {},
    onSubmit
  })

  useEffect(() => {
    if (valuesFromParent) {
      setValues({
        ...valuesFromParent
      })
    }
    //eslint-disable-next-line
  }, [valuesFromParent])

  return (
    <DefaultModal
      maxWidth="lg"
      open={open}
      modalTitle={title}
      onClickSave={handleSubmit}
      onCloseModal={onClose}
      buttonPrimaryText="Save"
      contentClass={classes.modalContent}
    >
      <Scrollbars autoHeight autoHeightMax={'calc(100vh - 200px)'}>
        {data.map(
          (
            {
              title: _title,
              actionName,
              hideActions,
              fieldName,
              list,
              title1,
              title2,
              icon1,
              icon2,
              hideHeader
            },
            index
          ) => (
            <AccordionRow
              key={`conflict-accordion-${index}`}
              title={_title}
              actionName={actionName}
              hideActions={hideActions}
              values={values}
              handleChange={handleChange}
              fieldName={fieldName}
              list={list}
              title1={title1}
              title2={title2}
              icon1={icon1}
              icon2={icon2}
              hideHeader={hideHeader}
            />
          )
        )}
      </Scrollbars>
    </DefaultModal>
  )
}

export default ConflictModal
