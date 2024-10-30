/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import { BlockInner } from "./block-inner";
import { getBlockStyles } from "./utils";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
function save(props) {
  const { className, attributes } = props;

  return (
    <div
      {...useBlockProps.save({
        className,
        style: getBlockStyles(props),
        role: "separator",
      })}
    >
      <BlockInner {...attributes} />
    </div>
  );
}

export default save;
