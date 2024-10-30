/**
 * WordPress dependencies
 */
import { createBlock } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import { name } from "./block.json";

const transforms = {
  from: [
    {
      type: "block",
      blocks: ["core/separator"],
      transform: (attributes) => {
        const {
          align,
          backgroundColor,
          style: { color = {} } = {},
        } = attributes;
        const borderColor = backgroundColor
          ? { slug: backgroundColor }
          : color?.background
          ? { value: color?.background }
          : undefined;

        let border;
        if (borderColor) {
          border = { width: "2px", style: "solid", color: borderColor };
        }
        return createBlock(name, { align, border });
      },
    },
  ],
  to: [
    {
      type: "block",
      blocks: ["core/separator"],
      transform: (attributes) => {
        const { align, border: { color = {} } = {} } = attributes;
        let backgroundColor;
        if (color?.slug) {
          backgroundColor = color.slug;
        }
        let style;
        if (color?.value) {
          style = {
            color: {
              background: color?.value,
            },
          };
        }

        return createBlock("core/separator", { align, backgroundColor, style });
      },
    },
  ],
};

export default transforms;
