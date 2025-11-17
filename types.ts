
export enum BlockType {
  Heading = 'heading',
  Paragraph = 'paragraph',
  Image = 'image',
  Link = 'link',
  Embed = 'embed',
  HorizontalRule = 'hr',
}

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BlockBase {
  type: BlockType.Heading;
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface ParagraphBlock extends BlockBase {
  type: BlockType.Paragraph;
  content: {
    text: string;
  };
}

export interface ImageBlock extends BlockBase {
  type: BlockType.Image;
  content: {
    src: string; // base64 data URL
    alt: string;
  };
}

export interface LinkBlock extends BlockBase {
  type: BlockType.Link;
  content: {
    text: string;
    href: string;
  };
}

export interface EmbedBlock extends BlockBase {
  type: BlockType.Embed;
  content: {
    code: string;
  };
}

export interface HorizontalRuleBlock extends BlockBase {
  type: BlockType.HorizontalRule;
  content: {};
}

export type ContentBlock = 
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | LinkBlock
  | EmbedBlock
  | HorizontalRuleBlock;
