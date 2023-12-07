import classNames from 'classnames'
import './_optionTabs.scss'

const OptionTabs = ({ optionsLength, selectedTab, onChangeTab = f => f }) => {
  return (
    <div className="option-tab__container">
      {Array(optionsLength)
        .fill()
        .map((_, index) => (
          <button
            key={`option-${index}`}
            className={classNames('option-tab__button', {
              active: selectedTab === index
            })}
            onClick={() => onChangeTab(index)}
          >
            {`Option ${index + 1}`}
          </button>
        ))}
    </div>
  )
}

export default OptionTabs
