const getStyles = ({ palette, type }, { onlyDate, showSeconds } = {}) => ({
  background: `${palette[type].formControls.multipleDatesPicker.popup.background} !important`,

  '& .rdrMonthAndYearWrapper': {
    '& .rdrNextPrevButton': {
      background: `${palette[type].formControls.multipleDatesPicker.popup.disabledBackground} !important`
    },
    '& .rdrPprevButton i': {
      borderColor: `transparent ${palette[type].formControls.multipleDatesPicker.popup.disabledColor} transparent transparent !important`
    },
    '& .rdrNextButton i': {
      borderColor: `transparent transparent transparent ${palette[type].formControls.multipleDatesPicker.popup.disabledColor} !important`
    }
  },

  '& .rdrMonthAndYearPickers': {
    '& select': {
      color: `${palette[type].formControls.multipleDatesPicker.popup.color} !important`,
      '& option': {
        background: `${palette[type].formControls.multipleDatesPicker.popup.background} !important`
      }
    }
  },

  '& .rdrMonths': {
    ...(onlyDate
      ? {}
      : {
          gap: showSeconds ? 168 : 120,
          marginRight: showSeconds ? 168 : 120
        }),

    '& .rdrDayDisabled': {
      background: `${palette[type].formControls.multipleDatesPicker.popup.disabledBackground} !important`,
      '& span': {
        color: `${palette[type].formControls.multipleDatesPicker.popup.disabledColor} !important`
      }
    },

    '& .rdrDay .rdrDayNumber span': {
      color: `${palette[type].formControls.multipleDatesPicker.popup.color}`
    }
  }
})

export default getStyles
