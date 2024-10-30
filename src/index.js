/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

/**
 * Internal dependencies
 */
import edit from "./edit";
import save from "./save";
import deprecated from "./deprecated";
import { ReactComponent as BlockIcon } from "./assets/block-icon.svg";
import metadata from "./block.json";
import transforms from "./transforms";

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata, {
  icon: BlockIcon,
  example: {
    attributes: {
      icon:
        '<svg class="bb-icon bb-icon--star-filled" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m10 1 3 6 6 .75-4.12 4.62L16 19l-6-3-6 3 1.13-6.63L1 7.75 7 7z"></path></svg>',
    },
  },
  deprecated,
  transforms,
  edit,
  save,
});
