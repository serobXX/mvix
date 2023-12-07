import { createContext, useMemo, useState } from 'react'

const ProfileCardContext = createContext({
  form: {},
  setForm: f => f
})

export default ProfileCardContext

export const withProfileCardContextProvider =
  WrapperComponent =>
  ({ ...props }) => {
    const [form, setForm] = useState({})

    const values = useMemo(() => ({ form, setForm }), [form])

    return (
      <ProfileCardContext.Provider value={values}>
        <WrapperComponent {...props} />
      </ProfileCardContext.Provider>
    )
  }
