import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import BaseEstelar from "./base-estelar.mdx";
import IglesiaElCamino from "./iglesia-el-camino.mdx";
import KitMultiagente from "./kit-multiagente.mdx";

type ProjectContent = ComponentType<{ components?: MDXComponents }>;

// Import estático por slug: el import dinámico con plantilla rompe el runtime de React en el layer de servidor.
export const projectContent: Record<string, ProjectContent> = {
  "base-estelar": BaseEstelar,
  "kit-multiagente": KitMultiagente,
  "iglesia-el-camino": IglesiaElCamino,
};
