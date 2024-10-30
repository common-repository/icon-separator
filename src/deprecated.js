/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import { BlockInner } from "./block-inner";
import { getBlockStyles } from "./utils";
import { attributes } from "./block.json";
import save from "./save";

/**
 * Deprecated
 */
export default [
  {
    attributes: {
      ...attributes,
      deprecatedCSSColorV1: {
        type: "boolean",
        default: true,
      },
    },
    save(props) {
      const { className, attributes } = props;

      return (
        <div
          {...useBlockProps.save({
            className,
            style: getBlockStyles(props),
          })}
        >
          <BlockInner {...attributes} />
        </div>
      );
    },
  },
  {
    attributes: {
      ...attributes,
      deprecatedCSSColorV1: {
        type: "boolean",
        default: true,
      },
    },
    save,
  },
];
