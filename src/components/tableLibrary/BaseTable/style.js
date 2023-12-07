export const getAgGridStyle = ({ palette, type, typography }) => ({
  '& .ag-theme-alpine': {
    height: '100%',
    '--ag-font-family': typography.fontFamily,
    '--ag-alpine-active-color': palette[type].tableLibrary.body.cell.active,
    '--ag-selected-row-background-color':
      palette[type].tableLibrary.body.row.selected,
    '--ag-row-hover-color': palette[type].tableLibrary.body.row.hover,

    '--ag-background-color': palette[type].tableLibrary.body.row.background,
    '--ag-odd-row-background-color':
      palette[type].tableLibrary.body.row.background,
    '--ag-foreground-color': palette[type].tableLibrary.body.cell.color,
    '--ag-border-color': palette[type].tableLibrary.body.cell.border,
    '--ag-secondary-border-color': palette[type].tableLibrary.body.cell.border,
    '--ag-disabled-foreground-color': `${palette[type].tableLibrary.body.cell.color}96`,

    '--ag-header-background-color': palette[type].tableLibrary.head.background,
    '--ag-subheader-background-color':
      palette[type].tableLibrary.head.background,
    '--ag-tooltip-background-color': palette[type].tableLibrary.head.background,

    '--ag-control-panel-background-color':
      palette[type].tableLibrary.sidePanel.background,
    '--ag-paging-background-color':
      palette[type].tableLibrary.footer.background,

    '--ag-cell-horizontal-padding': 'calc(var(--ag-grid-size) * 2)',
    '--ag-side-bar-panel-width': '315px',

    '& .ag-menu': {
      minWidth: 190
    },

    '& .ag-header': {
      height: '109px !important',
      minHeight: '109px !important',
      '& .ag-header-row-column-filter': {
        height: '60px !important'
      },

      '& .ag-checkbox-input-wrapper': {
        marginLeft: 7
      },

      '& .ag-header-cell-label': {
        '& .ag-sort-indicator-container': {
          position: 'absolute',
          right: 26
        }

        // '& .ag-sort-none-icon': {
        //   opacity: 0.5
        // },
        // '&:hover .ag-sort-none-icon': {
        //   display: 'block !important'
        // },
        // '&:hover .ag-sort-ascending-icon:not(.ag-hidden) ~ .ag-sort-none-icon, &:hover .ag-sort-descending-icon:not(.ag-hidden) ~ .ag-sort-none-icon':
        //   {
        //     display: 'none !important'
        //   }
      },

      '& .ag-header-cell-menu-button': {
        position: 'absolute',
        right: 7
      }
    },

    '&:not(.ag-show-floating-filter) .ag-header': {
      height: '49px !important',
      minHeight: '49px !important'
    },

    '& .ag-header-cell-comp-wrapper': {
      '& .ag-header-cell-sorted-asc, & .ag-header-cell-sorted-desc': {
        color: palette[type].tableLibrary.head.activeColor,
        '& .ag-header-cell-text': {
          fontWeight: '900'
        }
      },
      '& .ag-header-cell-text': {
        fontWeight: '400'
      }
    },
    '& .ag-root-wrapper': {
      border: 'none'
    },

    '& .ag-popup': {
      position: 'absolute'
    },

    '& .ag-paging-panel': {
      background: 'var(--ag-paging-background-color)'
    },

    '& .ag-row': {
      '&:hover .profile-card-animation': {
        opacity: 1,
        transform: 'rotate(0deg)'
      },
      '& .ag-cell-focus': {
        border: 'none !important'
      }
    },

    '& .ag-side-bar': {
      '& .ag-side-buttons': {
        background: 'var(--ag-control-panel-background-color)',
        zIndex: 101,

        '& .ag-selected': {
          color: 'var(--ag-selected-tab-underline-color)'
        }
      },
      '& .ag-react-container': {
        width: '100%'
      },
      '& .ag-tool-panel-wrapper': {
        zIndex: 101
      }
    },
    '& .ag-selection-checkbox': {
      marginLeft: 7
    },

    '& .ag-row .ag-cell': {
      display: 'flex',
      alignItems: 'center',
      padding: '0px 6px'
    },
    '& .ag-header-cell': {
      padding: '0px 6px'
    },
    '& .ag-row .ag-cell-inline-editing': {
      padding: 0
    },

    '& .ag-status-bar': {
      padding: 0,

      '& .ag-status-bar-right, & .ag-status-bar-right .ag-react-container': {
        width: '100%'
      }
    },

    // custom styles
    '& .ag-center-aligned-header': {
      '& .ag-header-cell-label': {
        justifyContent: 'center'
      }
    },

    '& .ag-center-aligned-cell': {
      justifyContent: 'center',
      textAlign: 'center'
    },

    '& .no-border': {
      border: 'none !important',
      outline: 'none'
    },

    '& .action-column': {
      opacity: 0,
      visibility: 'hidden',
      transition: '0.3s opacity'
    },

    '& .ag-row:hover, &:not(.ag-hide-action) .ag-row-selected': {
      '& .action-column': {
        opacity: 1,
        visibility: 'visible'
      }
    },

    // scroll
    '& *::-webkit-scrollbar': {
      width: '6px',
      height: '6px'
    },
    '& *::-webkit-scrollbar-thumb': {
      background: palette[type].scrollbar.background,
      borderRadius: '5px'
    },
    '& .ag-body-vertical-scroll': {
      '&, & .ag-body-vertical-scroll-viewport, & .ag-body-vertical-scroll-container':
        {
          width: '10px !important',
          minWidth: '10px !important'
        }
    },
    '& .ag-body-horizontal-scroll': {
      '&, & .ag-body-horizontal-scroll-viewport, & .ag-body-horizontal-scroll-container':
        {
          height: '10px !important',
          minHeight: '10px !important'
        },
      '& .ag-horizontal-right-spacer': {
        width: '10px !important',
        minWidth: '10px !important'
      }
    }
  }
})
