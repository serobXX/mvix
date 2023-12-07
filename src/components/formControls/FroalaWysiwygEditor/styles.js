export const getStyles = ({ palette, type, typography, colors }) => {
  const popup = {
    background: palette[type].froalaWysiwyg.toolbar.background,

    '& .fr-active-tab': {
      background: `${palette[type].froalaWysiwyg.toolbar.hoverBackground} !important`
    },
    '& .fr-special-character-category': {
      color: typography.darkText[type].color
    },
    '& .fr-special-character': {
      color: typography.lightText[type].color,
      '&:focus': {
        background: `${palette[type].froalaWysiwyg.toolbar.hoverBackground} !important`
      }
    },
    '& .fr-tabs': {
      background: `${palette[type].froalaWysiwyg.toolbar.background} !important`,

      '& .fr-command.fr-btn:not(:hover):not(:focus).fr-active, & .fr-command.fr-btn:not(:hover):not(:focus).fr-active':
        {
          background: palette[type].froalaWysiwyg.toolbar.hoverBackground
        }
    },
    '& .fr-image-upload-layer, & .fr-file-upload-layer': {
      borderColor: colors.highlight,
      ...typography.lightText[type],
      cursor: 'pointer',
      '&:hover': {
        background: 'transparent'
      }
    },
    '& .fr-input-line': {
      '& input': {
        background: `${palette[type].formControls.input.background} !important`,
        color: `${palette[type].formControls.input.color} !important`,
        borderColor: `${palette[type].formControls.input.border} !important`
      },
      '& input:hover': {
        borderColor: `${palette[type].formControls.input.border} !important`
      },
      '& label': {
        background: palette[type].formControls.input.background,
        color: palette[type].formControls.input.color
      }
    },
    '& .fr-separator': {
      background: palette[type].froalaWysiwyg.toolbar.border
    },
    '& .fr-icon-container': {
      '& i': {
        color: typography.lightText[type].color
      },
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: palette[type].scrollbar.background,
        borderRadius: '5px'
      }
    },
    '& .fr-icon': {
      width: '100%',
      padding: '12px 8px',
      borderRadius: 4
    }
  }
  return {
    root: {
      position: 'relative',
      '& .fr-box': {
        '& .fr-toolbar': {
          borderRadius: '4px 4px 0 0',
          background: palette[type].froalaWysiwyg.toolbar.background,
          borderColor: palette[type].froalaWysiwyg.toolbar.border,
          '& .fr-float-right': {
            marginLeft: 0,
            marginRight: 5
          },
          '& button, & a': {
            color: `${palette[type].froalaWysiwyg.toolbar.color} !important`,
            '& path': {
              color: `${palette[type].froalaWysiwyg.toolbar.color} !important`,
              fill: `${palette[type].froalaWysiwyg.toolbar.color} !important`
            }
          },

          ['& .fr-command.fr-expanded:not(.fr-table-cell), ' +
          '& .fr-command:hover:not(.fr-table-cell), ' +
          '& .fr-command.fr-btn.fr-open:not(:hover):not(:focus):not(:active), ' +
          '& .fr-command.fr-btn-hover:not(.fr-table-cell)']: {
            background: palette[type].froalaWysiwyg.toolbar.hoverBackground
          },
          '& .fr-command.fr-btn.fr-dropdown.fr-active': {
            background: palette[type].froalaWysiwyg.toolbar.hoverBackground
          },
          '& .fr-command.fr-btn.fr-options:hover, & .fr-command.fr-btn.fr-options.fr-btn-hover':
            {
              borderColor: palette[type].froalaWysiwyg.toolbar.border
            },
          '& .fr-more-toolbar': {
            background: palette[type].froalaWysiwyg.toolbar.background,
            '& button': {
              '& path': {
                color: `${palette[type].froalaWysiwyg.toolbar.color} !important`,
                fill: `${palette[type].froalaWysiwyg.toolbar.color} !important`
              }
            }
          },
          '& .fr-newline, & .fr-separator': {
            background: palette[type].froalaWysiwyg.toolbar.border
          },
          '& .fr-command.fr-btn.fr-btn-active-popup': {
            background: palette[type].froalaWysiwyg.toolbar.hoverBackground
          },
          '& .fr-btn-grp': {
            display: 'flex',
            flexWrap: 'wrap'
          },
          '& .fr-dropdown-menu': {
            background: palette[type].froalaWysiwyg.toolbar.background,

            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: palette[type].scrollbar.background,
              borderRadius: '5px'
            },

            '& .fr-active': {
              background: `${palette[type].froalaWysiwyg.toolbar.hoverBackground} !important`
            }
          },
          '& [id*="fontFamily-"].fr-active ~ [id*="dropdown-menu-fontFamily-"]':
            {
              overflow: 'hidden !important',

              '& .fr-dropdown-wrapper': {
                overflow: 'hidden auto',

                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: palette[type].scrollbar.background,
                  borderRadius: '5px'
                }
              }
            },
          '& .fr-checkbox-line': {
            ...typography.lightText[type]
          },
          '& .fr-emoticon-container': {
            '& .fr-emoticon:focus': {
              background: `${palette[type].froalaWysiwyg.toolbar.hoverBackground} !important`
            },
            '& .fr-icon': {
              height: 'fit-content',
              padding: '6px 8px'
            },
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: palette[type].scrollbar.background,
              borderRadius: '5px'
            }
          }
        },
        '& .fr-second-toolbar': {
          borderRadius: '0px 0px 4px 4px',
          background: palette[type].froalaWysiwyg.toolbar.background,
          borderColor: palette[type].froalaWysiwyg.toolbar.border,
          display: 'none'
        },
        '& .fr-dropdown-wrapper': {
          background: palette[type].froalaWysiwyg.toolbar.background,
          ...typography.lightText[type]
        },
        '& .fr-wrapper': {
          background: `${palette[type].froalaWysiwyg.wrapper.background} !important`,
          borderColor: `${palette[type].froalaWysiwyg.wrapper.border} !important`,

          '& p': {
            marginTop: 0,
            marginBottom: 0
          },

          '& .fr-code': {
            background: `${palette[type].froalaWysiwyg.wrapper.background} !important`,
            color: typography.darkText[type].color
          },

          '& .fr-element': {
            color: typography.lightText[type].color,

            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: palette[type].scrollbar.background,
              borderRadius: '5px'
            }
          }
        },
        '& .fr-popup': popup,
        '& .fr-quick-insert.fr-visible': {
          left: `100px !important`
        },
        '& .fr-quick-insert, & .fr-insert-helper, & .fr-qi-helper': {
          '& .fr-floating-btn': {
            padding: 0,
            background: colors.highlight,
            '& path': {
              color: palette[type].buttons.white.hover.color,
              fill: palette[type].buttons.white.hover.color
            }
          }
        }
      },
      '& > .fr-view': {
        padding: '10px 15px',
        background: palette[type].formControls.readOnly.background,
        color: palette[type].formControls.input.color,
        border: `1px solid ${palette[type].formControls.readOnly.border}`,
        borderRadius: 4,
        minHeight: 100,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: palette[type].scrollbar.background,
          borderRadius: '5px'
        }
      }
    },
    fullWidth: {
      width: '100%'
    },
    froalaRoot: {
      '& .fr-popup': {
        zIndex: '1301 !important',
        background: palette[type].froalaWysiwyg.toolbar.background,
        borderColor: palette[type].froalaWysiwyg.toolbar.border,
        '& button, & a': {
          '& path, & i': {
            color: `${palette[type].froalaWysiwyg.toolbar.color} !important`,
            fill: `${palette[type].froalaWysiwyg.toolbar.color} !important`
          }
        },

        ['& .fr-command.fr-expanded:not(.fr-table-cell), ' +
        '& .fr-command:hover:not(.fr-table-cell), ' +
        '& .fr-command.fr-btn.fr-open:not(:hover):not(:focus):not(:active), ' +
        '& .fr-command.fr-btn-hover:not(.fr-table-cell)']: {
          background: palette[type].froalaWysiwyg.toolbar.hoverBackground
        },
        '& .fr-command.fr-btn.fr-dropdown.fr-active': {
          background: palette[type].froalaWysiwyg.toolbar.hoverBackground
        },
        '& .fr-dropdown-menu': {
          background: `${palette[type].froalaWysiwyg.toolbar.background} !important`
        },
        '& .fr-dropdown-wrapper': {
          background: palette[type].froalaWysiwyg.toolbar.background,
          ...typography.lightText[type],

          '& .fr-active': {
            background: `${palette[type].froalaWysiwyg.toolbar.hoverBackground} !important`
          }
        },
        '& .fr-checkbox-line': {
          ...typography.lightText[type]
        },
        '& .fr-command.fr-btn.fr-dropdown.fr-active:hover': {
          background: `${palette[type].froalaWysiwyg.toolbar.hoverBackground} !important`
        },
        ...popup,
        '& .fr-separator': {
          background: palette[type].froalaWysiwyg.toolbar.border
        }
      }
    },
    errorIcon: ({ hidePlaceholder }) => ({
      color: colors.error,
      fontSize: 16,
      height: 20,
      width: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: '0.6',
      transition: '0.3s opacity',
      cursor: 'pointer',
      position: 'absolute',
      right: hidePlaceholder ? 11 : 58,
      top: 16,
      zIndex: 2
    }),
    fullPage: ({ pageColor }) => ({
      '& .fr-box .fr-wrapper': {
        background: `${pageColor || '#fff'} !important`,
        '& .fr-view': {
          background: `${pageColor || '#fff'} !important`
        },
        '& .fr-element': {
          color: '#000'
        }
      }
    }),
    rootDisabled: {
      '& .fr-box .fr-wrapper': {
        background: `${palette[type].formControls.disabled.background} !important`
      },
      '& .fr-toolbar': {
        opacity: '0.8'
      }
    },
    disabled: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0)',
      zIndex: 200
    }
  }
}
