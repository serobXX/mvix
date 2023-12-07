const sorting = (data, labelName) => {
  // Alphabetical sorting
  let newData = []
  if (labelName) {
    newData = data.sort((a, b) =>
      a[labelName].toString().toLowerCase() >
      b[labelName].toString().toLowerCase()
        ? 1
        : b[labelName].toString().toLowerCase() >
          a[labelName].toString().toLowerCase()
        ? -1
        : 0
    )
  }

  return newData
}

export default sorting
