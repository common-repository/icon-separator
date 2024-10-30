/**
 * External dependencies
 */
import { isUndefined, isEmpty } from "lodash";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  Button,
  __experimentalBorderControl as BorderControl,
} from "@wordpress/components";
import {
  useBlockProps,
  InspectorControls,
  BlockControls,
  JustifyToolbar,
  __experimentalSpacingSizesControl as SpacingSizesControl,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { store as blocksStore } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import {
  Placeholder,
  PreviewToolbar,
  SVGInputControl,
  ToggleGroupControl,
  ToggleGroupCustomControl,
  ColorGradientDropdown,
  LabelControl,
  BrowseIconsModal,
  useMultipleOriginColors,
  getAllBreakpoints,
  getBreakpointType,
  useInlineSVG,
  buildIconLibraryStore,
  useIconLibraryData,
  getResponsiveAttributeFieldValue,
  handleChangeResponsiveAttributeField,
  useColor,
  getColorObject,
  toType,
} from "./sdk.js";
import { useBlockInner } from "./block-inner";
import {
  getBlockStyles,
  keywords,
  IconWidthDefault,
  IconSpacingDefault,
  SeparatorWidthDefault,
  BorderDefault,
} from "./utils";

const STORE_NAME = "boldblocks/icon-separator";
buildIconLibraryStore(STORE_NAME);

/**
 * Migrate to new color
 *
 * @param {Boolean} toDefaultControl
 * @param {Array} allColors
 *
 * @returns {Object}
 */
const migrateBorder =
  (toDefaultControl = true, allColors) =>
  (border) => {
    let formatedBorder = border;
    if (border && "object" === toType(border)) {
      if (border?.color) {
        let color = border.color;
        const colorDataType = toType(color);
        if (toDefaultControl) {
          if (colorDataType === "object") {
            color = color?.value;
          }
        } else {
          if (colorDataType === "string") {
            color = getColorObject(color, allColors);
          }
        }

        formatedBorder = { ...border, color };
      }
    }

    return formatedBorder;
  };

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
  const { attributes, setAttributes, name, clientId, isSelected } = props;
  const {
    icon,
    iconWidth = { iconWidth: IconWidthDefault, value: IconWidthDefault },
    iconSpacing = {
      iconSpacing: IconSpacingDefault,
      value: IconSpacingDefault,
    },
    iconPosition = "center",
    justifyAlignment = "center",
    width,
    border = BorderDefault,
  } = attributes;

  // Get all breakpoints
  const allBreakpoints = getAllBreakpoints();

  // Get current breakpoint
  const breakpoint = getBreakpointType();

  // Color attributes
  const { colors, allColors } = useMultipleOriginColors();
  const [iconFillColor, setIconFillColor] = useColor(
    "iconFillColor",
    allColors,
  );
  const [iconStrokeColor, setIconStrokeColor] = useColor(
    "iconStrokeColor",
    allColors,
  );

  // Has variations or not
  const hasVariations = useSelect(
    (select) => select(blocksStore).getBlockVariations(name).length > 0,
    [name],
  );

  // State for open/close browse icons modal
  const [isOpenBrowseIconsModal, setIsOpenBrowseIconsModal] = useState(false);

  const [rawIcon, setRawIcon] = useInlineSVG(icon, (icon) =>
    setAttributes({ icon }),
  );

  const icons = useIconLibraryData({
    isloadData: isOpenBrowseIconsModal,
    storeName: STORE_NAME,
    apiPath: "icon-separator/v1/getIconLibrary",
  });

  // Margin
  const marginValues = getResponsiveAttributeFieldValue({
    fieldName: "margin",
    attributes,
    breakpoint,
  });

  // Width
  const widthValues = getResponsiveAttributeFieldValue({
    fieldName: "width",
    attributes,
    breakpoint,
    defaultValue: SeparatorWidthDefault,
  });

  // Border
  const borderValue = migrateBorder(true, allColors)(border);

  // Build blockInner
  const blockInner = useBlockInner(attributes);

  const blockProps = useBlockProps({ style: getBlockStyles(props) });

  const iconWidthLabel = __("Icon width", "icon-separator");
  const iconSpacingLabel = __("Icon spacing", "icon-separator");
  const iconPositionLabel = __("Icon position", "icon-separator");
  const iconColorLabel = __("Icon color", "icon-separator");

  const marginLabel = __("Margin");
  const separatorWidthLabel = __("Width", "icon-separator");
  const borderLabel = __("Line style", "icon-separator");
  const alinmentLabel = __("Justify alignment", "icon-separator");
  return (
    <>
      <BrowseIconsModal
        title={__("Icon library", "icon-separator")}
        isModalOpen={isOpenBrowseIconsModal}
        setIsModalOpen={setIsOpenBrowseIconsModal}
        icons={icons}
        onSubmit={setRawIcon}
        value={rawIcon}
        keywords={keywords}
      />
      <div {...blockProps}>
        {isUndefined(icon) && hasVariations ? (
          <>
            <Placeholder
              name={name}
              setAttributes={setAttributes}
              clientId={clientId}
              allowSkip={true}
              footer={
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpenBrowseIconsModal(true);
                  }}
                >
                  {__("Get icon from library", "icon-separator")}
                </Button>
              }
            />
          </>
        ) : (
          blockInner
        )}
      </div>
      {isSelected && (
        <>
          <BlockControls>
            <JustifyToolbar
              allowedControls={["left", "center", "right"]}
              value={justifyAlignment}
              onChange={(justifyAlignment) =>
                setAttributes({ justifyAlignment })
              }
            />
            <PreviewToolbar />
          </BlockControls>
          <InspectorControls group="settings">
            <ToolsPanel
              label={__("Icon settings", "icon-separator")}
              resetAll={() => {
                setRawIcon("");
                setAttributes({
                  iconWidth: {
                    iconWidth: IconWidthDefault,
                    value: IconWidthDefault,
                  },
                  iconSpacing: {
                    iconSpacing: IconSpacingDefault,
                    value: IconSpacingDefault,
                  },
                  iconPosition: "center",
                  iconFillColor: null,
                  iconStrokeColor: null,
                });
              }}
            >
              <ToolsPanelItem
                label={__("Icon", "icon-separator")}
                hasValue={() => !!icon}
                onDeselect={() => setRawIcon("")}
                isShownByDefault={true}
              >
                <SVGInputControl
                  value={rawIcon}
                  label={__("Input icon", "icon-separator")}
                  uploadLabel={__("Upload SVG icon", "icon-separator")}
                  inputLabel={__("Or input SVG icon markup", "icon-separator")}
                  onChange={setRawIcon}
                  toggleLibraryModal={setIsOpenBrowseIconsModal}
                  rows={6}
                  placeholder={__("Input SVG markup…", "icon-separator")}
                />
              </ToolsPanelItem>
              {!!icon && (
                <>
                  <ToolsPanelItem
                    label={iconWidthLabel}
                    hasValue={() =>
                      !!iconWidth &&
                      (iconWidth?.iconWidth !== IconWidthDefault ||
                        iconWidth?.value !== IconWidthDefault)
                    }
                    onDeselect={() =>
                      setAttributes({
                        iconWidth: {
                          iconWidth: IconWidthDefault,
                          value: IconWidthDefault,
                        },
                      })
                    }
                    isShownByDefault={true}
                  >
                    <ToggleGroupCustomControl
                      name="iconWidth"
                      label={iconWidthLabel}
                      options={[
                        { value: "1em", label: "1em" },
                        { value: "2em", label: "2em" },
                        { value: "3em", label: "3em" },
                        { value: "custom", label: __("Custom") },
                      ]}
                      value={iconWidth}
                      onChange={(iconWidth) => setAttributes({ iconWidth })}
                      isResponsive={false}
                    />
                  </ToolsPanelItem>
                  <ToolsPanelItem
                    label={iconSpacingLabel}
                    hasValue={() =>
                      !!iconSpacing &&
                      (iconSpacing?.iconSpacing !== IconSpacingDefault ||
                        iconSpacing?.value !== IconSpacingDefault)
                    }
                    onDeselect={() =>
                      setAttributes({
                        iconSpacing: {
                          iconSpacing: IconSpacingDefault,
                          value: IconSpacingDefault,
                        },
                      })
                    }
                    isShownByDefault={true}
                  >
                    <ToggleGroupCustomControl
                      name="iconSpacing"
                      label={iconSpacingLabel}
                      options={[
                        { value: ".5em", label: ".5em" },
                        { value: "1em", label: "1em" },
                        { value: "2em", label: "2em" },
                        { value: "custom", label: __("Custom") },
                      ]}
                      value={iconSpacing}
                      onChange={(iconSpacing) => setAttributes({ iconSpacing })}
                      isResponsive={false}
                    />
                  </ToolsPanelItem>
                  <ToolsPanelItem
                    label={iconPositionLabel}
                    hasValue={() => iconPosition !== "center"}
                    onDeselect={() => setAttributes({ iconPosition: "center" })}
                    isShownByDefault={true}
                  >
                    <ToggleGroupControl
                      label={iconPositionLabel}
                      options={[
                        { value: "left", label: __("Left") },
                        { value: "center", label: __("Center") },
                        { value: "right", label: __("Right") },
                      ]}
                      value={iconPosition}
                      onChange={(iconPosition) =>
                        setAttributes({ iconPosition })
                      }
                      isResponsive={false}
                    />
                  </ToolsPanelItem>
                  <ToolsPanelItem
                    label={iconColorLabel}
                    hasValue={() =>
                      (!isEmpty(iconFillColor) && iconFillColor?.value) ||
                      (!isEmpty(iconStrokeColor) && iconStrokeColor?.value)
                    }
                    onDeselect={() => {
                      setIconFillColor("");
                      setIconStrokeColor("");
                    }}
                    isShownByDefault={true}
                  >
                    <LabelControl
                      label={iconColorLabel}
                      isResponsive={false}
                      isBold={true}
                    />
                    <ColorGradientDropdown
                      enableAlpha={true}
                      settings={[
                        {
                          label: __("Fill color", "icon-separator"),
                          onColorChange: setIconFillColor,
                          colorValue: iconFillColor?.value,
                        },
                        {
                          label: __("Stroke color", "icon-separator"),
                          onColorChange: setIconStrokeColor,
                          colorValue: iconStrokeColor?.value,
                        },
                      ]}
                    />
                  </ToolsPanelItem>
                </>
              )}
            </ToolsPanel>
            <ToolsPanel
              label={__("Separator settings", "icon-separator")}
              resetAll={() => {
                setAttributes({
                  margin: {},
                  width: {},
                  border: BorderDefault,
                });
              }}
            >
              <ToolsPanelItem
                label={marginLabel}
                hasValue={() => !isEmpty(marginValues)}
                onDeselect={() => setAttributes({ margin: {} })}
                isShownByDefault={true}
              >
                <LabelControl label={marginLabel} isResponsive={true} />
                <SpacingSizesControl
                  label={__("Top and Bottom", "icon-separator")}
                  values={marginValues}
                  onChange={handleChangeResponsiveAttributeField({
                    fieldName: "margin",
                    setAttributes,
                    attributes,
                    breakpoint,
                    allBreakpoints,
                  })}
                  sides={["top", "bottom"]} // Use 'top' as the shorthand property in non-axial configurations.
                />
              </ToolsPanelItem>
              <ToolsPanelItem
                label={separatorWidthLabel}
                hasValue={() => !isEmpty(width)}
                onDeselect={() => setAttributes({ width: {} })}
                isShownByDefault={false}
              >
                <ToggleGroupCustomControl
                  name="width"
                  label={separatorWidthLabel}
                  options={[
                    { value: "100%", label: "100%" },
                    { value: "75%", label: "3/4" },
                    { value: "50%", label: "1/2" },
                    { value: "33.33333%", label: "1/3" },
                    { value: "25%", label: "1/4" },
                    { value: "custom", label: __("Custom") },
                  ]}
                  value={widthValues}
                  onChange={handleChangeResponsiveAttributeField({
                    fieldName: "width",
                    setAttributes,
                    attributes,
                    breakpoint,
                    allBreakpoints,
                  })}
                  isResponsive={true}
                />
              </ToolsPanelItem>
              <ToolsPanelItem
                label={borderLabel}
                hasValue={() =>
                  borderValue &&
                  (borderValue?.width !== BorderDefault.width ||
                    borderValue?.style !== BorderDefault.style ||
                    borderValue?.color)
                }
                onDeselect={() => setAttributes({ border: BorderDefault })}
                isShownByDefault={false}
              >
                <BorderControl
                  colors={colors}
                  label={borderLabel}
                  value={borderValue}
                  onChange={(value) =>
                    setAttributes({
                      border: migrateBorder(false, allColors)(value),
                    })
                  }
                  enableAlpha={true}
                  enableStyle={true}
                  __unstablePopoverProps={{
                    placement: "left-start",
                    offset: 40,
                    shift: true,
                  }}
                  __experimentalIsRenderedInSidebar={true}
                />
              </ToolsPanelItem>
              <ToolsPanelItem
                label={alinmentLabel}
                hasValue={() =>
                  !justifyAlignment || justifyAlignment !== "center"
                }
                onDeselect={() => setAttributes({ justifyAlignment: "center" })}
                isShownByDefault={false}
              >
                <ToggleGroupControl
                  label={alinmentLabel}
                  options={[
                    { value: "left", label: __("Left") },
                    { value: "center", label: __("Center") },
                    { value: "right", label: __("Right") },
                  ]}
                  value={justifyAlignment}
                  onChange={(justifyAlignment) =>
                    setAttributes({ justifyAlignment })
                  }
                  isResponsive={false}
                />
              </ToolsPanelItem>
            </ToolsPanel>
          </InspectorControls>
        </>
      )}
    </>
  );
}
