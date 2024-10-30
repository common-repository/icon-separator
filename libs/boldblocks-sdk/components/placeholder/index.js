/**
 * External dependencies
 */
import { get } from "lodash";
import styled from "@emotion/styled";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  store as blocksStore,
  createBlocksFromInnerBlocksTemplate,
} from "@wordpress/blocks";
import {
  store as blockEditorStore,
  useBlockProps,
  __experimentalBlockVariationPicker as BlockVariationPicker,
} from "@wordpress/block-editor";

/**
 * Internal dependencies
 */

const PlaceholderStyled = styled.div`
  flex-wrap: wrap;

  .block-editor-block-variation-picker__variations > li {
    margin-right: 8px;
  }

  .block-editor-block-variation-picker.has-many-variations
    .components-placeholder__fieldset {
    max-width: 100%;
  }

  .placeholder__footer {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex-basis: 100%;
    padding: 1em;
    background-color: #fff;
    box-shadow: inset 0 -1px 0 1px #1e1e1e;
  }
`;

export function Placeholder({
  clientId,
  name,
  setAttributes,
  allowSkip = false,
  skipVariation,
  footer = null,
}) {
  const { blockType, defaultVariation, variations } = useSelect(
    (select) => {
      const {
        getBlockVariations,
        getBlockType,
        getDefaultBlockVariation,
      } = select(blocksStore);

      return {
        blockType: getBlockType(name),
        defaultVariation: getDefaultBlockVariation(name, "block"),
        variations: getBlockVariations(name, "block"),
      };
    },
    [name]
  );

  const defaultBlockVariation =
    allowSkip && skipVariation ? skipVariation : defaultVariation;

  const { replaceInnerBlocks } = useDispatch(blockEditorStore);
  const blockProps = useBlockProps();

  return (
    <PlaceholderStyled {...blockProps}>
      <BlockVariationPicker
        icon={get(blockType, ["icon", "src"])}
        label={get(blockType, ["title"])}
        variations={variations}
        onSelect={(nextVariation = defaultBlockVariation) => {
          if (nextVariation.attributes) {
            setAttributes(nextVariation.attributes);
          }
          if (nextVariation.innerBlocks) {
            replaceInnerBlocks(
              clientId,
              createBlocksFromInnerBlocksTemplate(nextVariation.innerBlocks),
              true
            );
          }
        }}
        allowSkip={allowSkip}
      />
      {footer && <div className="placeholder__footer">{footer}</div>}
    </PlaceholderStyled>
  );
}
