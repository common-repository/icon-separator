/**
 * External dependencies
 */
import clsx from "clsx";

/**
 * WordPress dependencies
 */
import { useMemo } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { InlineSVG } from "../libs/boldblocks-sdk/components/svgs";
import { getSVGStyles } from "./utils";

/**
 * Render block content
 *
 * @param {Object}
 * @returns
 */
export const BlockInner = (attributes) => {
  const {
    icon,
    iconPosition = "center",
    justifyAlignment = "center",
  } = attributes;

  return (
    <div
      className={clsx(
        "wp-block-boldblocks-icon-separator__inner",
        `icon-${iconPosition}`,
        `is-align-${justifyAlignment}`,
      )}
      style={{ ...getSVGStyles({ attributes }) }}
    >
      <InlineSVG markup={icon} />
    </div>
  );
};

/**
 * Prevent from unnecessary InlineSVG render
 *
 * @param {Object} attributes
 * @returns {ReactComponent}
 */
export const useBlockInner = (attributes) => {
  const blockInner = useMemo(() => {
    return <BlockInner {...attributes} />;
  }, [attributes]);

  return blockInner;
};
