import React from "react";
import Card from "@/shared/components/ui/Card";
import Input from "@/shared/components/ui/Input";
import Textarea from "@/shared/components/ui/Textarea";
const NodePropertiesPanel = ({ node = {} as any, onChange }) => {
  if (!node) return null;
  const handle = (key: unknown, value: unknown) => onChange?.({ ...node, [key]: value });

  return (
        <>
      <Card title="Propriedades do Bloco" />
      <div className=" ">$2</div><Input
          value={ node.label || "" }
          onChange={ (e: unknown) => handle("label", e.target.value) }
          placeholder="Rótulo" />
        <Textarea
          value={ node.description || "" }
          onChange={ (e: unknown) => handle("description", e.target.value) }
          placeholder="Descrição" /></div></Card>);};

export default NodePropertiesPanel;
