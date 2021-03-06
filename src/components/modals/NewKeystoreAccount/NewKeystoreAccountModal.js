import React from 'react'
import PropTypes from 'prop-types'

import JTextInput from 'components/base/JTextInput'
import { PasswordField, SubmitModal } from 'components'
import { STEPS } from 'routes/JWallet/modules/modals/newKeystoreAccount'

class NewKeystoreAccountModal extends SubmitModal {
  renderModalBody = () => {
    switch (this.props.currentStep) {
      case STEPS.SAVE_MNEMONIC:
        return this.renderSaveMnemonic()
      case STEPS.CHECK_MNEMONIC:
        return this.renderCheckMnemonic()
      case STEPS.SET_PASSWORD:
        return this.renderSetPassword()
      default:
        return ''
    }
  }

  renderSaveMnemonic = () => {
    return (
      <JTextInput
        name='new-keystore-account-mnemonic'
        placeholder={i18n('modals.createAccount.placeholder.mnemonic')}
        value={this.props.mnemonic}
        editable
        readOnly
        multiline
        preventCopy
        unselectable
      />
    )
  }

  renderCheckMnemonic = () => {
    const {
      setNewKeystoreAccountMnemonicConfirm,
      validFields,
      invalidFields,
      mnemonicConfirm,
    } = this.props

    return (
      <JTextInput
        onValueChange={setNewKeystoreAccountMnemonicConfirm}
        name='new-keystore-account-mnemonic-confirm'
        placeholder={i18n('modals.createAccount.placeholder.mnemonicConfirm')}
        value={mnemonicConfirm}
        errorMessage={invalidFields.mnemonicConfirm}
        successMessage={validFields.mnemonicConfirm}
        editable
        multiline
      />
    )
  }

  renderSetPassword = () => {
    const {
      setNewKeystoreAccountPassword,
      setNewKeystoreAccountPasswordConfirm,
      validFields,
      invalidFields,
      password,
      passwordConfirm,
      isCreating,
      isInitialized,
    } = this.props

    if (isInitialized) {
      return (
        <JTextInput
          onValueChange={setNewKeystoreAccountPassword}
          name='new-keystore-account-password'
          placeholder={i18n('modals.createAccount.placeholder.password')}
          value={password}
          errorMessage={invalidFields.password}
          successMessage={validFields.password}
          editable={!isCreating}
          secureTextEntry
        />
      )
    }

    return (
      <PasswordField
        onPasswordChange={setNewKeystoreAccountPassword}
        onPasswordConfirmChange={setNewKeystoreAccountPasswordConfirm}
        password={password}
        passwordConfirm={passwordConfirm}
        passwordError={invalidFields.password}
        passwordConfirmError={invalidFields.passwordConfirm}
        withConfirm
      />
    )
  }

  isModalButtonDisabled = () => {
    const { invalidFields, password, mnemonicConfirm, currentStep } = this.props
    const isInvalidField = !!Object.keys(invalidFields).filter(f => invalidFields[f].length).length

    if (isInvalidField) {
      return true
    }

    if (currentStep === STEPS.CHECK_MNEMONIC) {
      return !mnemonicConfirm.length
    } else if (currentStep === STEPS.SET_PASSWORD) {
      return !password.length
    }

    return false
  }

  submitModal = () => {
    const { setNewKeystoreAccountCurrentStep, currentStep } = this.props

    setNewKeystoreAccountCurrentStep(currentStep)
  }

  closeModal = () => this.props.closeNewKeystoreAccountModal()
}

NewKeystoreAccountModal.propTypes = {
  closeNewKeystoreAccountModal: PropTypes.func.isRequired,
  setNewKeystoreAccountMnemonicConfirm: PropTypes.func.isRequired,
  setNewKeystoreAccountPassword: PropTypes.func.isRequired,
  setNewKeystoreAccountPasswordConfirm: PropTypes.func.isRequired,
  setNewKeystoreAccountCurrentStep: PropTypes.func.isRequired,
  validFields: PropTypes.shape({}).isRequired,
  invalidFields: PropTypes.shape({}).isRequired,
  mnemonic: PropTypes.string.isRequired,
  mnemonicConfirm: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  alert: PropTypes.string.isRequired,
  modalName: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  isInitialized: PropTypes.bool.isRequired,
}

export default NewKeystoreAccountModal
