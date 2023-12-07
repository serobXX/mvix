import { themeTypes } from 'constants/ui'
import localStorageItems from 'constants/localStorageItems'

export const LIGHT = themeTypes.light
export const DARK = themeTypes.dark

const FONT_WEIGHT_NORMAL = 400
const FONT_WEIGHT_BOLD = 700

export const colors = {
  light: '#74809A',
  highlight: '#1565C0',
  highlightDark: '#fff',
  accent: '#00b3ff',
  info: '#ba68c8',
  scheduleAccent: '#4dd0e1',
  devicesNavigation: '#64B5F6',
  mediaNavigation: '#EC407A',
  playlistNavigation: '#7986CB',
  reportNavigationLight: '#37474F',
  reportNavigationDark: '#90A4AE',
  appFooterDark: '#bac0cd',
  warning: '#c03829',
  clientNavigation: '#ff5e44',
  activeStatus: '#3cd480',
  inactiveStatus: '#d35e37',
  needsAttentionStatus: '#fec92e'
}

const localStorageTheme = localStorage.getItem(localStorageItems.theme)

const theme = {
  type: [themeTypes.dark, themeTypes.light].includes(localStorageTheme)
    ? localStorageTheme
    : themeTypes.light,
  overrides: {
    MuiCheckbox: {
      root: {
        padding: 0,
        color: '#afb7c7',
        '&$checked': {
          color: '#6bb9ff !important'
        }
      },
      checked: {}
    },
    MuiTableRow: {
      head: {
        height: 45
      }
    },
    MuiTableCell: {
      root: {
        borderBottomColor: '#e4e9f3',
        fontSize: '0.8125rem',
        color: '#2C2D3A',
        lineHeight: '1.6667em'
      },
      head: {
        paddingTop: 0,
        verticalAlign: 'baseline',
        fontSize: '0.8125rem',
        color: '#2C2D3A'
      },
      body: {
        paddingTop: '33px',
        paddingBottom: '33px',
        fontSize: '0.8125rem',
        color: '#74809A'
      },
      paddingCheckbox: {
        paddingLeft: '21px'
      }
    },
    MuiTableSortLabel: {
      root: {
        '&:hover': {
          color: 'inherit',
          fontWeight: 'bold'
        },
        '&:focus': {
          color: 'inherit'
        }
      },
      active: {
        color: 'inherit'
      }
    },
    MuiLink: {
      root: {
        display: 'inline-block'
      }
    },
    MuiPaper: {
      root: {
        color: 'inherit'
      },
      rounded: {
        borderRadius: '8px'
      }
    },
    MuiToggleButton: {
      root: {
        lineHeight: 'normal'
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: '#0277bd',
        color: '#fff',
        fontSize: '13px',
        lineHeight: '16px',
        fontWeight: '400',
        maxWidth: '230px',
        textAlign: 'left',
        padding: 10,
        borderRadius: 4,
        boxShadow: '0px 5px 15px 0px rgb(0 0 0 / 30%)',
        hyphens: 'auto'
      },
      popperArrow: {
        '&[x-placement*="top"] .xhibit-MuiTooltip-arrow': {
          width: 27,
          height: 19,
          bottom: -8
        },
        '&[x-placement*="bottom"] .xhibit-MuiTooltip-arrow': {
          width: 27,
          height: 19,
          top: -8
        },
        '&[x-placement*="left"] .xhibit-MuiTooltip-arrow': {
          right: -17,
          width: 20,
          height: 30,
          margin: 0
        },
        '&[x-placement*="right"] .xhibit-MuiTooltip-arrow': {
          left: -19,
          width: 20,
          height: 30,
          margin: 0
        }
      },
      arrow: {
        color: '#0277bd'
      }
    },
    MuiTypography: {
      root: {
        display: 'block'
      },
      body1: {
        fontSize: 13
      },
      body2: {
        color: '#2C2D3A'
      },
      colorPrimary: {
        color: colors.highlight
      }
    },
    MuiFormLabel: {
      root: {
        color: '#74809A',
        fontSize: '0.8125rem',
        lineHeight: '1.6667em'
      }
    },
    MuiButton: {
      root: {
        fontFamily: [
          '"Nunito Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
        ].join(',')
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        padding: '0 20px'
      }
    },
    MuiSwitch: {
      switchBase: {
        height: 15
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 'auto',
        marginRight: 16
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#0a83c8'
      },
      toolbarLandscape: {
        maxWidth: 'auto'
      }
    },
    MuiPickersClock: {
      container: {
        margin: '8px 0'
      },
      pin: {
        backgroundColor: '#0a83c8'
      }
    },
    MuiPickersClockPointer: {
      thumb: {
        borderColor: '#0a83c8',
        backgroundColor: '#0a83c8 !important',
        boxSizing: 'content-box !important'
      },
      pointer: {
        backgroundColor: '#0a83c8'
      }
    },
    MuiPickersClockNumber: {
      clockNumber: {
        fontSize: '16px',
        color: '#74809a',
        lineHeight: 'unset'
      }
    }
  },
  mixins: {
    textHover: {
      fontWeight: FONT_WEIGHT_NORMAL,
      '&:hover': {
        fontWeight: FONT_WEIGHT_BOLD
      }
    }
  },
  shapes: {
    height: {
      primary: 32,
      secondary: 35
    },
    fontSize: {
      primary: 13,
      small: 12,
      secondary: 15
    }
  },
  colors: {
    inherit: 'inherit',
    dark: '#2C2D3A',
    light: colors.light,
    highlight: colors.highlight,
    green: colors.activeStatus,
    inactive: colors.inactiveStatus,
    error: '#f84b6a',
    optionalError: colors.highlight,
    warning: colors.warning,
    youtube: {
      [LIGHT]: '#282828',
      [DARK]: '#ffffff'
    },
    border: {
      [LIGHT]: '#e4e9f3',
      [DARK]: '#1E3966'
    },
    title: {
      primary: {
        [LIGHT]: '#0f2147',
        [DARK]: '#e4e9f3'
      }
    },
    background: {
      primary: {
        [LIGHT]: '#fff',
        [DARK]: '#0A1526'
      },
      secondary: {
        [LIGHT]: '#F5F6FA80',
        [DARK]: '#0F1F37'
      },
      third: {
        [LIGHT]: '#F5F6FA',
        [DARK]: '#162841'
      },
      designGallery: {
        [LIGHT]: '#f9fafc',
        [DARK]: '#0A1526'
      }
    },
    schedule: {
      [LIGHT]: colors.scheduleAccent,
      [DARK]: colors.scheduleAccent
    },
    footer: {
      [LIGHT]: colors.light,
      [DARK]: colors.appFooterDark
    },
    other: {
      color1: {
        [LIGHT]: colors.devicesNavigation,
        [DARK]: colors.devicesNavigation
      },
      color2: {
        [LIGHT]: colors.mediaNavigation,
        [DARK]: colors.mediaNavigation
      },
      color3: {
        [LIGHT]: colors.playlistNavigation,
        [DARK]: colors.playlistNavigation
      },
      color4: {
        [LIGHT]: colors.info,
        [DARK]: colors.info
      },
      color6: {
        [LIGHT]: colors.reportNavigationLight,
        [DARK]: colors.reportNavigationDark
      },
      color7: {
        [LIGHT]: colors.clientNavigation,
        [DARK]: colors.clientNavigation
      }
    }
  },
  fontSize: {
    primary: 13,
    secondary: 16,
    small: 12,
    smaller: 11,
    smallest: 10,
    big: 18,
    bigger: 22,
    biggest: 37
  },
  lineHeight: {
    primary: '22px',
    secondary: '25px',
    small: '20px',
    smaller: '18px',
    smallest: '20px',
    big: '30px',
    bigger: '35px',
    biggest: '45px'
  },
  spacing: 8,
  fontWeight: {
    normal: FONT_WEIGHT_NORMAL,
    bold: FONT_WEIGHT_BOLD
  },
  palette: {
    light: {
      default: '#fff',
      secondary: '#F4F4F7',
      body: {
        background: '#f9fafc'
      },
      header: {
        borderColor: '#e6eaf4',
        shadow: {
          f: '#F4F4F7',
          s: '#EEEEEF'
        },
        navItem: {
          color: '#888996',
          activeColor: '#102046'
        },
        rightAction: {
          iconColor: '#9394A0'
        },
        account: {
          color: '#888996'
        }
      },
      dropdown: {
        background: '#fff',
        borderColor: '#e6eaf4',
        shadow: '#b6bac6',
        listItem: {
          background: '#fff',
          color: '#74809a',
          border: '#f5f6fa',
          hover: {
            background: 'rgba(230, 234, 244, 0.15)',
            color: '#047abc'
          }
        }
      },
      card: {
        background: '#fff',
        shadow: '#f4f6fb',
        titleColor: '#2c2d3a',
        greyHeader: {
          background: '#f5f6fa',
          color: '#74809a',
          border: '#e4e9f3',
          height: '57px',
          doubleLineHeight: '70px'
        },
        flatHeader: {
          color: '#0f2147'
        },
        footer: {
          height: '55px'
        }
      },
      helperCard: {
        background: '#f5fcff'
      },
      groupCard: {
        background: '#f9fafc',
        templateBackground: '#f5f6fa',
        titleColor: '#1575bc',
        templateTitleColor: '#1575bc',
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        item: {
          label: '#000',
          button: {
            color: '#74809a'
          }
        },
        button: {
          color: '#0a83c8'
        },
        dropdown: {
          border: '#e4e9f3',
          background: '#f5f6fa',
          color: '#0f2147',
          content: {
            background: '#fff',
            color: '#000'
          }
        }
      },
      deviceCard: {
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        header: {
          background: '#f9fafc'
        },
        row: {
          background: '#f5f6fa',
          value: '#0f2147'
        },
        button: {
          color: '#0a83c8'
        },
        footer: {
          background: '#f9fafc'
        }
      },
      templateCreate: {
        background: '#fff'
      },
      templateCard: {
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        header: {
          background: '#f9fafc'
        },
        footer: {
          background: '#f9fafc'
        }
      },
      tagCard: {
        background: '#fff',
        shadow: 'rgba(228, 233, 243, 0.62)',
        border: '#e6eaf4',
        label: {
          color: '#2c2d3a'
        },
        item: {
          color: '#040d37',
          background: 'rgba(240, 243, 249, 0.4)'
        },
        button: {
          color: '#74809a'
        }
      },
      weatherCard: {
        color: '#888996',
        tempColor: '#2c2d3a'
      },
      directionToggle: {
        color: '#606066'
      },
      charts: {
        bandwidth: {
          titleColor: '#000',
          leftLabel: {
            color: '#0f2147'
          }
        },
        devices: {
          countColor: '#000'
        },
        weather: {
          background: '#fff'
        }
      },
      tabs: {
        background: '#fff',
        toggleButton: {
          background: '#fff',
          color: '#74809A',
          border: '#e4e9f3'
        }
      },
      roundedTabs: {
        background: '#fff'
      },
      list: {
        background: '#fff',
        item: {
          color: '#888996',
          colorActive: '#888996'
        }
      },
      buttons: {
        white: {
          color: '#74809a',
          background: '#fff',
          border: '#d8deea',
          shadow: 'rgba(216, 222, 234, 0.5)',
          hover: {
            color: '#fff',
            border: colors.highlight
          }
        },
        blue: {
          disabled: '#fff'
        },
        iconButton: {
          color: '#AFB7C7'
        },
        contentAppHelpBtn: {
          color: 'rgba(230,126,34,1)',
          background: '#fff',
          border: 'rgba(230,126,34,1)'
        }
      },
      pageContainer: {
        background: '#fff',
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        header: {
          background: '#f5f6fa',
          border: '#E4E9F4',
          titleColor: '#2C2D3A',
          selecting: '#EFF0F4',
          infoIcon: {
            border: '#e4e9f3',
            color: '#afb7c7'
          },
          button: {
            iconColor: '#0a83c8'
          }
        },
        subHeader: {
          background: '#f9fafc',
          border: '#E4E9F4'
        }
      },
      tableLibrary: {
        paper: {
          background: '#fff'
        },
        head: {
          color: '#2C2D3A',
          iconColor: '#afb7c7',
          background: '#fff',
          activeColor: '#000'
        },
        body: {
          row: {
            background: '#fff',
            hover: '#0000000a',
            selected: '#f5005714',
            button: {
              background: '',
              color: '',
              border: ''
            },
            dropdown: {
              background: '#fff',
              shadow: '#b6bac6',
              list: {
                background: '#fff'
              }
            }
          },
          cell: {
            color: '#74809A',
            border: '#e4e9f3',
            active: '#6bb9ff'
          }
        },
        sidePanel: {
          background: '#f9fafc'
        },
        footer: {
          background: '#f9fafc',
          pagination: {
            border: '#e4e9f3',
            button: {
              background: '',
              border: '',
              color: '#74809a',
              shadow: 'rgba(216, 222, 234, 0.5)'
            }
          }
        }
      },
      table: {
        head: {
          background: 'rgba(175, 183, 199, 0.5)',
          color: '#000',
          border: '#e4e9f3'
        },
        body: {
          row: {
            selected: {
              background: 'rgba(175, 183, 199, 0.25)'
            }
          },
          cell: {
            color: '#9394A0'
          }
        }
      },
      checkbox: {
        color: ''
      },
      radioButton: {
        color: '',
        checked: colors.highlight
      },
      formControls: {
        input: {
          background: '#fff',
          border: '#ced4da',
          color: '#74809A'
        },
        disabled: {
          background: 'rgb(245, 245, 245)',
          color: 'rgba(0, 0, 0, 0.3)'
        },
        readOnly: {
          border: 'rgba(206, 212, 218, 0.5)',
          background: 'rgba(245, 245, 245, 0.5)'
        },
        label: {
          color: '#74809A',
          activeColor: colors.highlight
        },
        multipleTimePicker: {
          input: {
            background: '#fff',
            border: '#d4dce7',
            color: '#4c5057'
          },
          label: {
            color: '#4c5057'
          }
        },
        multipleDatesPicker: {
          input: {
            border: '#ced4da',
            color: '#9394A0',
            background: '#f5f6fa'
          },
          popup: {
            background: '#ffffff',
            color: '#1d2429',
            disabledColor: '#aeb9bf',
            disabledBackground: '#f8f8f8'
          }
        },
        select: {
          background: '#fff',
          border: '#E4E9F3',
          color: '#494F5C',
          shadow: '#B6BAC6',
          active: {
            background: '#F8FBFF !important'
          }
        },
        placeholder: {
          color: '#9394a0'
        },
        timeDuration: {
          item: {
            color: '#000'
          }
        }
      },
      sideModal: {
        background: '#fff',
        header: {
          titleColor: '#686a82'
        },
        footer: {
          backgroundColor: '#F9FAFC',
          border: '#d7dde3'
        },
        content: {
          border: '#e4e9f3'
        },
        action: {
          background: '#f5f6fa',
          border: '#f5f6fa',
          button: {
            color: '#74809A',
            background: 'linear-gradient(to right, #ffffff, #fefefe)',
            border: '#cbd3e3'
          }
        },
        switcher: {
          label: {
            color: '#74809A'
          }
        },
        tabs: {
          header: {
            background: '#F5F6FA',
            border: '#e6eaf4'
          },
          item: {
            titleColor: '#040d37'
          }
        },
        groups: {
          header: {
            background: '#f5f6fa',
            titleColor: '#0f2147'
          },
          button: {
            border: '#d8deea',
            background: '#f9fafc',
            color: '#535d73'
          }
        }
      },
      modal: {
        background: '#fff',
        shadow: '#b6bac6'
      },
      sideTab: {
        selected: {
          background: '#fff',
          color: colors.highlight
        }
      },
      upperTab: {
        background: '#ffffff',
        selected: {
          color: colors.highlight
        }
      },
      singleIconTab: {
        color: '#9394a0',
        hover: {
          color: '#000'
        }
      },
      mediaInfo: {
        card: {
          background: '#F5F6FA80',
          titleInfo: '#4c5057',
          expandIconColor: '#7A7B7D'
        }
      },
      loader: {
        color: '#000',
        background: '#f5f6f7',
        foreground: '#eee',
        backgroundColor: 'rgba(255,255,255,.5)'
      },
      iconSelect: {
        color: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      },
      suggestionBox: {
        background: '#fff',
        title: '#000',
        subtitle: '#74809A'
      },
      pages: {
        dashboard: {
          card: {
            border: '#e4e9f3',
            boxShadow:
              'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
            background: '#f5f6fa'
          }
        },
        accountSettings: {
          button: {
            iconColor: '#757575'
          },
          content: {
            background: '#fff',
            border: '#e4e9f3'
          },
          accountInfo: {
            color: '#0f2147'
          },
          card: {
            iconColor: '#757575',
            border: '#e4e9f3'
          },
          clientDetails: {
            row: {
              border: '#f5f6fa',
              valueColor: '#0f2147'
            }
          },
          bandwidth: {
            leftLabel: {
              color: '#0f2147'
            }
          }
        },
        adminSettings: {
          content: {
            border: '#e4e9f3'
          }
        },
        users: {
          addUser: {
            titles: {
              color: '#0f2147'
            },
            fab: {
              background: '#fcfcfc',
              border: '#e4e9f3'
            },
            border: '#e4e9f3',
            button: {
              color: '#818ca4',
              background: 'linear-gradient(to right, #ffffff, #fefefe)',
              border: '#cbd3e3'
            }
          }
        },
        packages: {
          sideModal: {
            item: {
              border: '#f5f6fa'
            }
          }
        },
        rss: {
          addRss: {
            upload: {
              background: 'linear-gradient(to bottom, #ffffff, #fafbfd)',
              border: 'rgba(228, 233, 243, 0.23)',
              titleColor: '#0f2147',
              button: {
                background: 'linear-gradient(to bottom, #e4e9f3, #cdd4e4)',
                color: '#74809a',
                border: '#e4e9f3'
              }
            },
            editorToolbar: {
              border: 'rgba(228, 233, 243, 0.5)',
              background: 'rgba(245, 246, 250, 0.5)'
            },
            manage: {
              border: '#e4e9f3',
              background: 'rgba(245, 246, 250, 0.6)',
              titleColor: '#74809a',
              category: {
                color: '#040d37'
              }
            }
          }
        },
        oem: {
          addClient: {
            item: {
              border: '#f5f6fa'
            },
            features: {
              item: {
                color: '#000'
              }
            },
            actions: {
              background: '#f5f6fa',
              border: '#f5f6fa'
            }
          }
        },
        banners: {
          preview: {
            border: '#e4e9f3'
          }
        },
        clients: {
          addClient: {
            button: {
              iconColor: '#0a83c8'
            }
          }
        },
        devices: {
          alerts: {
            tabs: {
              card: {
                header: {
                  background: '#f5f6fa'
                }
              },
              recordInfo: {
                background: 'rgba(245, 246, 250, 0.3)',
                color: '#0a83c8'
              }
            },
            mediaModal: {
              cap: {
                password: {
                  background: '#f5f6fa'
                }
              }
            },
            content: {
              background: '#fff9f0'
            }
          },
          groups: {
            item: {
              color: '#74809a'
            }
          },
          rebootModal: {
            title: {
              color: '#000'
            },
            info: {
              label: {
                color: '#74809A'
              },
              value: {
                color: '#000'
              }
            }
          }
        },
        smartPlaylist: {
          card: {
            background: 'linear-gradient(to bottom, #ffffff, #fafbfd)',
            titleColor: '#040d37',
            root: {
              background: '#fefeff'
            },
            button: {
              color: '#0a83c8'
            }
          }
        },
        fonts: {
          background: '#fff',
          border: '#e4e9f3',
          header: {
            background: 'rgba(245, 246, 250, 0.2)',
            input: {
              background: 'rgba(245, 246, 250, 0.2)'
            }
          },
          item: {
            color: '#333',
            fontName: {
              color: '#000'
            }
          },
          footer: {
            background: '#f9fafc',
            border: '#e4e9f3'
          }
        },
        createTemplate: {
          border: '#e4e9f3',
          types: {
            background: 'linear-gradient(to bottom, #fff, #fafbfd)',
            item: {
              color: '#2C2D3A',
              hover: {
                color: colors.highlight
              }
            }
          },
          template: {
            viewContainer: {
              border: 'linear-gradient(132deg, #e4e9f3, #e4e9f3 77%, #e4e9f3)',
              background: '#fff'
            },
            footer: {
              background: 'linear-gradient(to bottom, #fff, #fafbfd)'
            }
          },
          footer: {
            background: '#f5f6fa'
          },
          settings: {
            background: '#f9fafc',
            expansion: {
              header: {
                background: '#F5F6FA',
                color: '#74809A'
              },
              body: {
                background: '#FAFAFC',
                formControl: {
                  color: '#74809A'
                },
                icon: {
                  color: '#000'
                }
              }
            }
          },
          modal: {
            item: {
              color: '#000'
            }
          },
          zoomToFit: {
            color: '#000'
          }
        },
        schedule: {
          boldTitle: '#4c5057',
          timeline: {
            icon: '#afb7c7',
            title: '#000',
            border: '#E4E9F4',
            background: '#f5f6fa',
            header: {
              icon: '#0a83c8'
            },
            device: {
              background: '#f5f6fa'
            }
          }
        },
        reports: {
          generate: {
            border: '#e4e9f3',
            background: '#F5F6FA',
            color: '#0f2147',
            dataTables: {
              divider: {
                background: 'linear-gradient(180deg, #F3F6FA 0%, #E4E9F3 100%)'
              },
              item: {
                border: '#e4e9f3',
                background: '#fdfdfe',
                color: '#8a8ea3'
              }
            },
            filters: {
              item: {
                border: '#b6cedb',
                background: '#fff',
                titleColor: '#53627c',
                textColor: '#2c2c2c',
                indexColor: '#424242'
              }
            },
            popup: {
              color: '#2c2c2c',
              toggleItems: {
                border: '#d8deea',
                background: '#fff'
              },
              chartType: {
                border: '#c8d3e8',
                background: '#f7f9ff'
              }
            },
            info: {
              chart: {
                labelColor: '#000',
                subColor: 'rgba(0, 0, 0, 0.25)'
              }
            },
            iconColor: '#000'
          },
          report: {
            color: '#102046',
            table: {
              border: '#E4E9F3',
              head: {
                background: '#F5F6FA'
              },
              cell: {
                background: '#fff',
                first: {
                  background: '#F9FAFC'
                },
                hover: {
                  background: '#F0F4FB'
                }
              }
            }
          }
        },
        media: {
          background: '#fff',
          card: {
            border: '#e4e9f3',
            background: '#F5F6FA80',
            header: {
              background: '#F5F6FA',
              color: '#2C2D3A'
            }
          },
          general: {
            card: {
              border: '#e4e9f3',
              background: '#F5F6FA80',
              header: {
                background: '#F5F6FA',
                color: '#2C2D3A'
              }
            },
            chart: {
              types: {
                color: '#4C5057',
                background: '#FFFFFF',
                active: {
                  color: '#0A83C8',
                  background: '#FFFFFF'
                },
                sub: {
                  color: '#4C5057',
                  active: {
                    background: '#f3f9fc',
                    color: '#0A83C8'
                  }
                }
              }
            }
          },
          local: {
            card: {
              color: '#2C2D3A',
              background: '#FAFBFD',
              border: '#D4DCE7',
              header: {
                background: 'linear-gradient(270deg, #FDFEFE 0%, #F8F9FC 100%)'
              },
              input: {
                label: {
                  color: '#4C5057'
                }
              }
            }
          },
          gallery: {
            poster: {
              border: '#CBD3E3',
              background: '#FAFAFD',
              header: {
                color: '#9394A0'
              }
            },
            quote: {
              color: '#4C5057',
              background: '#F9FAFC'
            }
          },
          premium: {
            color: '#000000',
            currency: {
              background: '#F5F6FA'
            }
          },
          licenced: {
            color: '#000'
          },
          custom: {
            color: '#000'
          }
        },
        singIn: {
          background: '#fff',
          color: '#000',
          border: '#ddddde',
          subtitle: '#9394a0',
          social: {
            facebook: '#4469a2',
            linkedIn: '#0078ba'
          }
        },
        profile: {
          passwords: {
            background: '#F3F5F7'
          }
        },
        tags: {
          add: {
            label: {
              color: 'rgba(0, 0, 0, 0.54)'
            }
          },
          disabled: {
            color: 'rgb(206, 212, 218)'
          }
        },
        customField: {
          edit: {
            leftContent: {
              background: '#f5f6fa'
            }
          }
        },
        rbac: {
          background: '#FFF',
          emphasis: '#000',
          primary: '#74809A',
          border: '#E6EAF4',
          shadow: '0 1px 2px 1px #E4E9F3',
          header: {
            background: '#F5F6FA',
            border: '#E4E9F4'
          },
          roles: {
            hover: {
              color: '#0A83C8'
            },
            active: {
              background: '#F5FbFF',
              color: '#0A83C8'
            },
            chip: {
              color: '#74809A',
              border: '#D8DEEA',
              shadow: '0 1px 0 0 #D8DEEA50'
            }
          },
          group: {
            border: '#E4E9F4',
            color: '#000'
          },
          toggle: {
            border: '#E4E9F4'
          }
        }
      },
      scheduleSelector: {
        root: {
          border: '#ddddde',
          background: '#fff'
        },
        dialogTitle: {
          color: '#808B9C'
        },
        labelInterval: {
          color: '#0f2147'
        }
      },
      dialog: {
        background: '#fff',
        header: {
          color: '#040d37',
          background: '#f5f6fa',
          height: '57px'
        },
        closeButton: '#74809a',
        border: '#E4E9F4',
        title: '#040d37',
        subtitle: '#040d3799',
        text: '#9394A0',
        shadow: '#000000'
      },
      languageSelector: {
        background: '#fff',
        color: '#74809A'
      },
      scrollbar: {
        background: '#25252550'
      },
      deviceCardPreview: {
        background: '#F4F4F7',
        title: '#FFF',
        boxShadow: '0 2px 4px 0 #e1e3ec',
        dateColor: '#74809A',
        border: 'solid 1px #e6eaf4'
      },
      scheduleCalendar: {
        card: {
          borderColor: 'rgba(224, 224, 224, 1)'
        }
      },
      messageArea: {
        color: '#74809A'
      },
      alertAlarmCard: {
        background: '#e4e9f3',
        color: '#74809A',
        hoverColor: '#1c5dca'
      },
      searchDropdown: {
        header: {
          background: '#f9fafc',
          color: '#74809A',
          border: '#e4e9f3'
        }
      },
      detailPage: {
        profileCard: {
          avatar: {
            color: '#ffffff'
          },
          footer: {
            background: '#f5f6fa',
            border: '#f5f6fa'
          }
        },
        timelineLog: {
          card: {
            background: '#fff',
            headerBackground: '#f5f6fa'
          },
          circleBackground: '#fff',
          border: '#dcdee0'
        }
      },
      froalaWysiwyg: {
        toolbar: {
          background: '#f5f6fa',
          color: '#333333',
          border: '#CCCCCC',
          hoverBackground: '#fff'
        },
        wrapper: {
          background: '#ffffff',
          border: '#CCCCCC'
        }
      },
      alert: {
        warning: {
          background: 'rgb(255, 244, 229)',
          color: 'rgb(102, 60, 0)'
        },
        success: {},
        info: {},
        error: {}
      },
      customAccordion: {
        header: {
          background: '#f5f6fa'
        },
        content: {
          background: '#fff'
        }
      }
    },
    dark: {
      default: '#0A1526',
      secondary: '#15263D',
      body: {
        background: '#0A1526'
      },
      header: {
        borderColor: '#000',
        shadow: {
          f: '#000',
          s: '#15263D'
        },
        navItem: {
          color: '#8993A3',
          activeColor: '#8993A3'
        },
        rightAction: {
          iconColor: '#5C697F'
        },
        account: {
          color: '#8993A3'
        }
      },
      dropdown: {
        background: '#15263D',
        borderColor: '#162949',
        shadow: '#000000',
        listItem: {
          background: '#15263D',
          color: '#74809A',
          border: '#0A1526',
          hover: {
            background: 'rgba(230, 234, 244, 0.15)',
            color: '#fff'
          }
        }
      },
      card: {
        background: '#15263D',
        shadow: '#0A1526',
        titleColor: '#8993A3',
        greyHeader: {
          background: '#15263D',
          color: '#808B9C',
          border: '#162949',
          height: '57px',
          doubleLineHeight: '70px'
        },
        flatHeader: {
          color: '#808B9C'
        },
        footer: {
          height: '55px'
        }
      },
      helperCard: {
        background: '#f5fcff0d'
      },
      groupCard: {
        background: '#0A1526',
        templateBackground: '#15263D',
        titleColor: '#8993A3',
        templateTitleColor: '#fff',
        border: '#1E3966',
        shadow: '#1E3966',
        item: {
          label: '#fff',
          button: {
            color: '#fff'
          }
        },
        button: {
          color: '#fff'
        },
        dropdown: {
          border: '#1E3966',
          background: '#0A1526',
          color: '#808B9C',
          content: {
            background: '#15263D',
            color: '#fff'
          }
        }
      },
      deviceCard: {
        border: '#162949',
        shadow: '#15263D',
        header: {
          background: '#0A1526'
        },
        row: {
          background: '#162949',
          value: '#808B9C'
        },
        button: {
          color: '#fff'
        },
        footer: {
          background: '#162949'
        }
      },
      templateCreate: {
        background: '#9394A0'
      },
      templateCard: {
        border: '#0A1526',
        shadow: '#0A1526',
        header: {
          background: '#0A1526'
        },
        footer: {
          background: '#0e1c31'
        }
      },
      tagCard: {
        background: '#162949',
        shadow: '',
        border: '#15263D',
        label: {
          color: '#fff'
        },
        item: {
          color: '#808B9C',
          background: '#0A1526'
        },
        button: {
          color: '#74809a'
        }
      },
      weatherCard: {
        color: '#8993A3',
        tempColor: '#fff'
      },
      directionToggle: {
        color: '#fff'
      },
      charts: {
        bandwidth: {
          titleColor: '#fff',
          leftLabel: {
            color: '#808B9C'
          }
        },
        devices: {
          countColor: '#fff'
        },
        weather: {
          background: '#15263D'
        }
      },
      tabs: {
        background: 'transparent',
        toggleButton: {
          background: '#343D4E',
          color: '#fff',
          border: '#343D4E'
        }
      },
      roundedTabs: {
        background: '#15263D'
      },
      list: {
        background: '#15263D',
        item: {
          color: '#8993A3',
          colorActive: '#8993A3'
        }
      },
      pageContainer: {
        background: '#0A1526',
        border: '#162949',
        shadow: '#162949',
        header: {
          background: '#15263D',
          border: '#15263D',
          titleColor: '#fff',
          selecting: '#172B44',
          infoIcon: {
            border: '#0A1526',
            color: '#5C697F'
          },
          button: {
            iconColor: '#fff'
          }
        },
        subHeader: {
          background: 'rgba(21, 38, 61, 0.64)',
          border: '#162949'
        }
      },
      buttons: {
        white: {
          color: '#fff',
          background: '#15263D',
          border: '#d8deea',
          shadow: 'rgba(39, 33, 21, 0.5)',
          hover: {
            color: '#15263D',
            border: colors.highlight
          }
        },
        blue: {
          disabled: '#15263D'
        },
        iconButton: {
          color: '#5C697F'
        },
        contentAppHelpBtn: {
          color: 'rgba(230,126,34,1)',
          background: 'rgba(21, 38, 61, 0.64)',
          border: 'rgba(230,126,34,1)'
        }
      },
      tableLibrary: {
        paper: {
          background: '#0A1526'
        },
        head: {
          color: '#fff',
          iconColor: '#5C697F',
          background: '#0A1526',
          activeColor: '#fff'
        },
        body: {
          row: {
            background: '#0A1526',
            hover: '#0A1526',
            selected: '#f5005714',
            button: {
              background: '#5C697F',
              border: '#5C697F',
              color: '#0A1526'
            },
            dropdown: {
              background: '#15263D',
              shadow: '#162949',
              list: {
                background: '#15263D'
              }
            }
          },
          cell: {
            color: '#74809A',
            border: '#162949',
            active: '#6bb9ff'
          }
        },
        sidePanel: {
          background: 'rgba(21, 38, 61, 1)'
        },
        footer: {
          background: 'rgba(21, 38, 61, 0.64)',
          pagination: {
            border: '#0A1526',
            button: {
              background: '#112034',
              border: '#1E3966',
              color: '#9394A0',
              shadow: 'transparent'
            }
          }
        }
      },
      table: {
        head: {
          background: '#0A1526',
          color: '#fff',
          border: '#162949'
        },
        body: {
          row: {
            selected: {
              background: 'rgba(10, 21, 38, 0.5)'
            }
          },
          cell: {
            color: '#9394A0'
          }
        }
      },
      checkbox: {
        color: '#1E3966'
      },
      radioButton: {
        color: '#808181',
        checked: colors.highlight
      },
      formControls: {
        input: {
          background: '#112034',
          border: '#1E3966',
          color: '#74809A'
        },
        disabled: {
          background: '#172b47',
          color: '#757575'
        },
        readOnly: {
          border: 'rgba(30, 57, 102, 0.5)',
          background: 'rgba(23, 43, 71, 0.5)'
        },
        label: {
          color: '#74809A',
          activeColor: '#fff'
        },
        multipleTimePicker: {
          input: {
            background: '#112034',
            border: '#1E3966',
            color: '#9394A0'
          },
          label: {
            color: '#9394A0'
          }
        },
        multipleDatesPicker: {
          input: {
            border: '#1E3966',
            color: '#9394A0',
            background: '#15263D'
          },
          popup: {
            background: '#15263D',
            color: '#ffffff',
            disabledColor: '#6e757a',
            disabledBackground: '#111e30'
          }
        },
        select: {
          background: '#112034',
          border: '#1E3966',
          color: '#9394A0',
          shadow: '#1E3966',
          active: {
            background: '#1E3966 !important'
          }
        },
        placeholder: {
          color: '#9394a0'
        },
        timeDuration: {
          item: {
            color: '#fff'
          }
        }
      },
      sideModal: {
        after: {
          background:
            'linear-gradient(to left, rgba(0, 0, 0, 0.26), rgba(255, 255, 255, 0))'
        },
        background: '#15263D',
        header: {
          titleColor: '#808B9C'
        },
        footer: {
          backgroundColor: '#112034',
          border: '#1E3966'
        },
        content: {
          border: '#1E3966'
        },
        action: {
          background: '#15263D',
          border: '#1E3966',
          button: {
            color: '#fff',
            background: '#1175BC',
            border: '#1175BC'
          }
        },
        switcher: {
          label: {
            color: 'rgba(255, 255, 255, 0.54)'
          }
        },
        tabs: {
          header: {
            background: '#162841',
            border: '#1E3966'
          },
          item: {
            titleColor: '#808B9C'
          }
        },
        groups: {
          header: {
            background: '#15263D',
            titleColor: '#808B9C'
          },
          button: {
            border: '#1175BC',
            background: '#1175BC',
            color: '#fff'
          }
        }
      },
      modal: {
        background: '#15263D',
        shadow: '#1E3966'
      },
      sideTab: {
        selected: {
          background: '#0F1F37',
          color: '#fff'
        }
      },
      upperTab: {
        background: '#15263d',
        selected: {
          color: colors.highlight
        }
      },
      singleIconTab: {
        color: '#8993A3',
        hover: {
          color: '#fff'
        }
      },
      mediaInfo: {
        card: {
          background: '#0F1F37',
          titleColor: '#8993A3',
          expandIconColor: '#CCC'
        }
      },
      loader: {
        color: '#fff',
        background: '#15263D',
        foreground: '#1E3966',
        backgroundColor: 'rgba(0,0,0,.5)'
      },
      iconSelect: {
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      },
      suggestionBox: {
        background: '#15263D',
        title: '#fff',
        subtitle: '#9394A0'
      },
      pages: {
        dashboard: {
          card: {
            border: '#1E3966',
            boxShadow:
              'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
            background: '#15263D'
          }
        },
        accountSettings: {
          button: {
            iconColor: '#fff'
          },
          content: {
            background: '#0A1526',
            border: '#162949'
          },
          accountInfo: {
            color: '#808B9C'
          },
          card: {
            iconColor: '#5C697F',
            border: '#162949'
          },
          clientDetails: {
            row: {
              border: '#162949',
              valueColor: '#EFEFEF'
            }
          },
          bandwidth: {
            leftLabel: {
              color: '#808B9C'
            }
          }
        },
        adminSettings: {
          content: {
            border: '#1E3966'
          }
        },
        users: {
          addUser: {
            titles: {
              color: '#808B9C'
            },
            fab: {
              background: '#15263D',
              border: '#1E3966'
            },
            border: '#1E3966',
            button: {
              color: '#fff',
              background: '#1175BC',
              border: '#1175BC'
            }
          }
        },
        packages: {
          sideModal: {
            item: {
              border: '#1E3966'
            }
          }
        },
        rss: {
          addRss: {
            upload: {
              background: '#15263D',
              border: '#1E3966',
              titleColor: 'rgba(255, 255, 255, 0.54)',
              button: {
                background: '#1E3966',
                color: '#fff',
                border: '#1E3966'
              }
            },
            editorToolbar: {
              border: '#1E3966',
              background: '#15263D'
            },
            manage: {
              border: '#1E3966',
              background: '#0A1526',
              titleColor: 'rgba(255, 255, 255, 0.54)',
              category: {
                color: 'rgba(255, 255, 255, 0.54)'
              }
            }
          }
        },
        oem: {
          addClient: {
            item: {
              border: '#1E3966'
            },
            features: {
              item: {
                color: 'rgba(255, 255, 255, 0.54)'
              }
            },
            actions: {
              background: '#15263D',
              border: '#1E3966'
            }
          }
        },
        banners: {
          preview: {
            border: '#1E3966'
          }
        },
        clients: {
          addClient: {
            button: {
              iconColor: '#fff'
            }
          }
        },
        devices: {
          alerts: {
            tabs: {
              card: {
                header: {
                  background: '#0A1526'
                }
              },
              recordInfo: {
                background: '#15263D',
                color: '#fff'
              }
            },
            mediaModal: {
              cap: {
                password: {
                  background: '#0A1526'
                }
              }
            },
            content: {
              background: '#15263D'
            }
          },
          groups: {
            item: {
              color: '#fff'
            }
          },
          rebootModal: {
            title: {
              color: '#fff'
            },
            info: {
              label: {
                color: 'rgba(255, 255, 255, 0.54)'
              },
              value: {
                color: '#fff'
              }
            }
          }
        },
        smartPlaylist: {
          card: {
            background: '#15263D',
            titleColor: '#9394A0',
            root: {
              background: '#0A1526'
            },
            button: {
              color: '#fff'
            }
          }
        },
        fonts: {
          background: '#0A1526',
          border: '#162949',
          header: {
            background: '#0A1526',
            input: {
              background: '#0A1526'
            }
          },
          item: {
            color: '#9394A0',
            fontName: {
              color: '#fff'
            }
          },
          footer: {
            border: '#162949',
            background: 'rgba(21, 38, 61, 0.64)'
          }
        },
        createTemplate: {
          border: '#162949',
          types: {
            background: '#0A1526',
            item: {
              color: '#9394A0',
              hover: {
                color: '#fff'
              }
            }
          },
          template: {
            viewContainer: {
              border: '#162949',
              background: '#fff'
            },
            footer: {
              background: '#0A1525'
            }
          },
          footer: {
            background: '#15263D'
          },
          settings: {
            background: '#0a1526',
            expansion: {
              header: {
                background: '#162841',
                color: '#74809A'
              },
              body: {
                background: '#0f1f37',
                formControl: {
                  color: '#74809A'
                },
                icon: {
                  color: 'rgba(255, 255, 255, 0.54)'
                }
              }
            }
          },
          modal: {
            item: {
              color: '#fff'
            }
          },
          zoomToFit: {
            color: '#fff'
          }
        },
        schedule: {
          boldTitle: '#9394A0',
          timeline: {
            icon: '#8993A3',
            title: '#fff',
            border: '#15263D',
            background: '#15263D',
            header: {
              icon: '#fff'
            },
            device: {
              background: '#0A1526'
            }
          }
        },
        reports: {
          generate: {
            border: '#162949',
            background: '#0A1526',
            color: '#9394A0',
            dataTables: {
              divider: {
                background: '#162949'
              },
              item: {
                border: '#1E3966',
                background: '#15263D',
                color: '#9394A0'
              }
            },
            filters: {
              item: {
                border: '#1E3966',
                background: '#15263D',
                titleColor: '#9394A0',
                textColor: '#9394A0',
                indexColor: '#fff'
              }
            },
            popup: {
              color: '#9394A0',
              toggleItems: {
                border: '#1E3966',
                background: '#15263D'
              },
              chartType: {
                border: '#1E3966',
                background: '#15263D'
              }
            },
            info: {
              chart: {
                labelColor: '#fff',
                subColor: 'rgba(255, 255, 255, 0.25)'
              }
            },
            iconColor: '#fff'
          },
          report: {
            color: '#9394A0',
            table: {
              border: '#1E3966',
              head: {
                background: '#0A1526'
              },
              cell: {
                background: '#15263D',
                first: {
                  background: '#0A1526'
                },
                hover: {
                  background: ''
                }
              }
            }
          }
        },
        media: {
          background: '#0F1F37',
          card: {
            border: '#1E3966',
            background: '#0F1F37',
            header: {
              background: '#162841',
              color: '#9394A0'
            }
          },
          general: {
            card: {
              border: '#1E3966',
              background: '#0F1F37',
              header: {
                background: '#162841',
                color: '#9394A0'
              }
            },
            chart: {
              types: {
                color: '#9394A0',
                background: '#15263D',
                active: {
                  color: '#0A83C8',
                  background: '#15263D'
                },
                sub: {
                  color: '#9394A0',
                  active: {
                    background: '#0A1526',
                    color: '#0A83C8'
                  }
                }
              }
            }
          },
          local: {
            card: {
              color: '#9394A0',
              background: '#15263D',
              border: '#1E3966',
              header: {
                background: '#15263D'
              },
              input: {
                label: {
                  color: '#808B9C'
                }
              }
            }
          },
          gallery: {
            poster: {
              border: '#1E3966',
              background: '#15263D',
              header: {
                color: '#808B9C'
              }
            },
            quote: {
              color: '#808B9C',
              background: '#0A1526'
            }
          },
          premium: {
            color: '#9394A0',
            currency: {
              background: '#15263D'
            }
          },
          licenced: {
            color: '#9394A0'
          },
          custom: {
            color: '#9394A0'
          }
        },
        singIn: {
          background: '#15263D',
          color: '#fff',
          subtitle: '#9394a0',
          border: '#1E3966',
          social: {
            facebook: '#fff',
            linkedIn: '#fff'
          }
        },
        profile: {
          passwords: {
            background: '#1E3966'
          }
        },
        tags: {
          add: {
            label: {
              color: 'rgba(255, 255, 255, 0.54)'
            }
          },
          disabled: {
            color: '#1E3966'
          }
        },
        customField: {
          edit: {
            leftContent: {
              background: '#0a1526'
            }
          }
        },
        rbac: {
          background: '#0A1526',
          emphasis: '#FFF',
          primary: '#74809A',
          border: '#162949',
          shadow: '0 1px 2px 1px #162949',
          header: {
            background: '#15263D',
            border: '#1E3966'
          },
          roles: {
            hover: {
              color: '#F5FBFF'
            },
            active: {
              background: '#15263D',
              color: '#F5FBFF'
            },
            chip: {
              color: '#0A1526',
              border: '#5C697F',
              shadow: 'none'
            }
          },
          group: {
            border: '#1E3966',
            color: '#8993A3'
          },
          toggle: {
            border: '#1E3966'
          }
        }
      },
      scheduleSelector: {
        root: {
          border: '#1E3966',
          background: '#15263D'
        },
        dialogTitle: {
          color: '#808B9C'
        },
        labelInterval: {
          color: '#808B9C'
        }
      },
      dialog: {
        background: '#111F33',
        header: {
          color: '#fff',
          background: '#15263D',
          height: '57px'
        },
        closeButton: '#808B9C',
        border: '#14263d',
        title: '#fff',
        subtitle: '#ffffff99',
        text: '#9394A0',
        shadow: '#34619B'
      },
      languageSelector: {
        background: '#0A1526',
        color: '#74809A'
      },
      scrollbar: {
        background: '#BABABA50'
      },
      deviceCardPreview: {
        background: '#0A1526',
        title: '#FFF',
        boxShadow: '0 2px 4px 0 #15263D, 0 2px 4px 0 #000',
        dateColor: '#74809A',
        border: 'solid 1px #162949'
      },
      scheduleCalendar: {
        card: {
          borderColor: '#162949'
        }
      },
      messageArea: {
        color: '#808B9C'
      },
      alertAlarmCard: {
        background: '#162949',
        color: '#74809A',
        hoverColor: '#1c5dca'
      },
      searchDropdown: {
        header: {
          background: '#112034',
          color: '#74809A',
          border: '#1E3966'
        }
      },
      detailPage: {
        profileCard: {
          avatar: {
            color: '#0a1526'
          },
          footer: {
            background: '#1b2f4b',
            border: '#162949'
          }
        },
        timelineLog: {
          card: {
            background: '#15263d',
            headerBackground: '#15263d'
          },
          circleBackground: '#15263d',
          border: '#5f5f5f'
        }
      },
      froalaWysiwyg: {
        toolbar: {
          background: '#15263d',
          color: '#d2e4f9',
          border: '#1E3966',
          hoverBackground: '#0A1526'
        },
        wrapper: {
          background: '#0A1526',
          border: '#1E3966'
        }
      },
      alert: {
        warning: {
          background: 'rgb(25, 18, 7)',
          color: 'rgb(255, 226, 183)'
        },
        success: {
          background: 'rgb(12, 19, 13)',
          color: 'rgb(204, 232, 205)'
        },
        info: {
          background: 'rgb(7, 19, 24)',
          color: 'rgb(184, 231, 251)'
        },
        error: {
          background: 'rgb(22, 11, 11)',
          color: 'rgb(244, 199, 199)'
        }
      },
      customAccordion: {
        header: {
          background: '#15263D'
        },
        content: {
          background: '#0A1526'
        }
      }
    },
    background: { default: '#f9fafc' },
    buttons: {
      primary: {
        theme1: {
          border: '1px solid',
          color: '#fff',
          background: colors.highlight,
          borderColor: colors.highlight,
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        theme2: {
          border: '1px solid',
          color: '#fff',
          background: '#E34843',
          borderColor: '#E34843',
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        theme3: {
          border: '1px solid',
          color: '#fff',
          background: colors.info,
          borderColor: colors.info,
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        theme4: {
          border: '1px solid',
          color: '#fff',
          background: colors.accent,
          borderColor: colors.accent,
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        hover: {
          theme1: {
            color: '#74809A',
            background: '#fff'
          },
          theme2: {
            color: '#E34843',
            background: '#fff'
          },
          theme3: {
            color: colors.info,
            background: '#fff'
          },
          theme4: {
            color: colors.accent,
            background: '#fff'
          }
        }
      },
      secondary: {
        theme1: {
          border: '1px solid',
          color: '#74809A',
          background: '#fff',
          borderColor: colors.highlight,
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        theme2: {
          border: '1px solid',
          color: '#E34843',
          background: '#fff',
          borderColor: '#E34843',
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        theme3: {
          border: '1px solid',
          color: colors.info,
          background: '#fff',
          borderColor: colors.info,
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        theme4: {
          border: '1px solid',
          color: colors.accent,
          background: '#fff',
          borderColor: colors.accent,
          boxShadow: '0 2px 4px 0 rgba(216, 222, 234, 0.5)'
        },
        hover: {
          theme1: {
            color: '#fff',
            background: colors.highlight
          },
          theme2: {
            color: '#fff',
            background: '#E34843'
          },
          theme3: {
            color: '#fff',
            background: colors.info
          },
          theme4: {
            color: '#fff',
            background: colors.accent
          }
        }
      }
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      '"Nunito Sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    pageTitle: {
      light: {
        color: '#2C2D3A'
      },
      dark: {
        color: '#fff'
      }
    },
    lightText: {
      light: {
        color: '#74809A',
        fontSize: '0.8125rem',
        lineHeight: '1.667em',
        fontWeight: '400'
      },
      dark: {
        fontSize: '0.8125rem',
        lineHeight: '1.667em',
        color: '#74809A',
        fontWeight: '400'
      }
    },
    darkText: {
      light: {
        fontSize: '0.8125rem',
        lineHeight: '1.667em',
        color: '#2C2D3A',
        fontWeight: '400'
      },
      dark: {
        fontSize: '0.8125rem',
        lineHeight: '1.667em',
        color: '#fff',
        fontWeight: '400'
      }
    },
    lightAccent: {
      light: {
        color: '#74809A'
      },
      dark: {
        fontSize: '0.8125rem',
        lineHeight: '1.667em',
        color: '#74809A',
        fontWeight: '700'
      }
    },
    darkAccent: {
      light: {
        fontSize: '0.8125rem',
        lineHeight: '1.667em',
        color: '#2C2D3A',
        fontWeight: '700'
      },
      dark: {
        fontSize: '0.8125rem',
        lineHeight: '1.667em',
        color: '#fff',
        fontWeight: '700'
      }
    },
    subtitle: {
      light: {
        fontSize: '0.75rem',
        lineHeight: '1.6667em',
        color: '#74809A',
        fontWeight: '400'
      },
      dark: {
        fontSize: '0.75rem',
        lineHeight: '1.6667em',
        color: '#74809A',
        fontWeight: '400'
      }
    },
    dashboardTitle: {
      light: {
        fontSize: '16px',
        lineHeight: '1.667em',
        color: '#2C2D3A',
        fontWeight: '400'
      },
      dark: {
        fontSize: '16px',
        lineHeight: '1.667em',
        color: '#fff',
        fontWeight: '400'
      }
    }
  },
  formControls: {
    placeholder: {
      opacity: 0.42
    },
    label: {
      fontSize: 13,
      lineHeight: '24px',
      color: '#74809A'
    },
    input: {
      padding: '5px 15px',
      fontSize: 13,
      height: 35,
      paddingLeft: 15
    },
    root: {
      height: 38
    },
    mediaApps: {
      numericInput: {
        input: {
          padding: '9px 15px !important',
          fontSize: '14px !important'
        },
        root: {
          height: '38px !important',
          '& > span': {
            height: '38px !important'
          }
        }
      },
      selectInput: {
        input: {
          padding: '5px 15px',
          fontSize: 14,
          height: 35
        },
        label: {
          fontSize: '1.0833rem',
          lineHeight: '24px',
          transform: 'scale(0.75)',
          color: '#74809A'
        }
      },
      colorSelect: {
        input: {
          padding: '5px 15px',
          fontSize: 14,
          width: '100%',
          height: 35
        },
        label: {
          fontSize: '1.0833rem',
          lineHeight: '24px',
          transform: 'scale(0.75)',
          color: '#74809A'
        }
      },
      timeDurationPicker: {
        input: {
          padding: '5px 15px',
          fontSize: 14,
          height: 35
        },
        label: {
          fontSize: '1.0833rem',
          lineHeight: '24px',
          transform: 'scale(0.75)',
          color: '#74809A'
        }
      },
      refreshEverySlider: {
        input: {
          width: 'calc(2em + 26px)',
          height: 38,
          fontSize: 13
        },
        root: {
          alignItems: 'center'
        },
        label: {
          lineHeight: '24px',
          color: '#74809A'
        }
      }
    }
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: {
      xs: 0,
      sm: 576,
      md: 720,
      lg: 1080,
      xl: 1440
    }
  }
}

export default theme
