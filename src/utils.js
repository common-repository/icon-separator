/**
 * External dependencies
 */
import { isUndefined, isString } from "lodash";

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
import {
  getColorCSSValue,
  getColorCSSValueDeprecatedV1,
  isValidSettingObject,
  buildBorderStyle,
  isValueSpacingPreset,
  getSpacingPresetCssVar,
} from "../libs/boldblocks-sdk/utils";

/**
 * Build the CSS value for spacing value
 *
 * @param {Mixed} rawValue
 * @returns {String}
 */
function buildSpacingCSSValue(rawValue) {
  if (isValueSpacingPreset(rawValue)) {
    return getSpacingPresetCssVar(rawValue);
  }

  return rawValue + "";
}

/**
 * Build width style
 *
 * @param {Object} attributes
 * @returns
 */
function buildMarginStyle(attributes) {
  const { margin } = attributes;
  let style = {};
  if (isValidSettingObject(margin)) {
    Object.keys(margin).forEach((breakpoint) => {
      const { value, inherit } = margin[breakpoint];
      if (isUndefined(value)) {
        if (inherit && isString(inherit)) {
          const { value: inheritValue } = margin[inherit] ?? {};
          if (isValidSettingObject(inheritValue)) {
            const { top, bottom } = inheritValue;
            if (top) {
              style = {
                ...style,
                [`--bb--margin-top--${breakpoint}`]: `var(--bb--margin-top--${inherit})`,
              };
            }
            if (bottom) {
              style = {
                ...style,
                [`--bb--margin-bottom--${breakpoint}`]: `var(--bb--margin-bottom--${inherit})`,
              };
            }
          }
        }
      } else {
        if (isValidSettingObject(value)) {
          const { top, bottom } = value;
          if (top) {
            style = {
              ...style,
              [`--bb--margin-top--${breakpoint}`]: buildSpacingCSSValue(top),
            };
          }
          if (bottom) {
            style = {
              ...style,
              [`--bb--margin-bottom--${breakpoint}`]:
                buildSpacingCSSValue(bottom),
            };
          }
        }
      }
    });
  }

  return style;
}

/**
 * Build styles for the block
 *
 * @param {Object} props
 */
export function getBlockStyles(props) {
  const { attributes } = props;

  let styles = {};

  // Margin
  styles = { ...buildMarginStyle(attributes) };

  // Padding

  return styles;
}

/**
 * Build width style
 *
 * @param {Object} attributes
 * @returns
 */
function buildWidthStyle(attributes) {
  const { width } = attributes;
  let style = {};
  if (isValidSettingObject(width)) {
    Object.keys(width).forEach((breakpoint) => {
      const { value: { value } = {}, inherit } = width[breakpoint];
      if (isUndefined(value)) {
        if (inherit && isString(inherit)) {
          const { value: inheritValue } = width[inherit] ?? {};
          if (inheritValue) {
            style = {
              ...style,
              [`--bb--width--${breakpoint}`]: `var(--bb--width--${inherit})`,
            };
          }
        }
      } else {
        if (value) {
          style = {
            ...style,
            [`--bb--width--${breakpoint}`]: value + "",
          };
        }
      }
    });
  }

  return style;
}

/**
 * Build styles for the block inner element
 *
 * @param {Object} props
 */
export function getSVGStyles(props) {
  const {
    attributes,
    attributes: {
      iconWidth: { value: iconWidth = "1em" } = {},
      iconSpacing: { value: iconSpacing = ".5em" } = {},
      iconFillColor,
      iconStrokeColor,
      lineColor,
      border = { width: "1px", style: "solid" },
      deprecatedCSSColorV1,
    },
  } = props;

  let styles = {};

  // Determine color format
  const buildColorCssValue = !deprecatedCSSColorV1
    ? getColorCSSValue
    : getColorCSSValueDeprecatedV1;

  // Separator width
  styles = { ...styles, ...buildWidthStyle(attributes) };

  // Boder style
  styles["--bb-border"] = buildBorderStyle(border, buildColorCssValue);

  // Icon width
  styles["--bb--icon-width"] = iconWidth;

  // Icon spacing
  styles["--bb--icon-spacing"] = iconSpacing;

  const iconFillColorStyle = buildColorCssValue(iconFillColor);
  if (iconFillColorStyle) {
    styles["--bb--icon-fill-color"] = iconFillColorStyle;
  }
  const iconStrokeColorStyle = buildColorCssValue(iconStrokeColor);
  if (iconStrokeColorStyle) {
    styles["--bb--icon-stroke-color"] = iconStrokeColorStyle;
  }
  const lineColorStyle = buildColorCssValue(lineColor);
  if (lineColorStyle) {
    styles["--bb--line-color"] = lineColorStyle;
  }

  return styles;
}

export const keywords = [
  "flower",
  "star",
  "gear",
  "sharp",
  "shape",
  "arrow",
  "diamond",
  "circle",
  "heart",
  "sign",
  "shield",
  "man",
  "person",
  "car",
  "logo",
  "alert",
  "smile",
  "bell",
  "outline",
];

export const IconWidthDefault = "1em";
export const IconSpacingDefault = ".5em";
export const SeparatorWidthDefault = { width: "100%", value: "100%" };
export const BorderDefault = { width: "1px", style: "solid" };
