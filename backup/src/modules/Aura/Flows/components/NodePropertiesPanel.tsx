import React from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
const NodePropertiesPanel = ({ node = {}, onChange }) => {
  if (!node) return null;
  const handle = (key, value) => onChange?.({ ...node, [key]: value });
  return (
    <Card title="Propriedades do Bloco">
      <div className="space-y-3">
        <Input
          value={node.label || ""}
          onChange={(e) => handle("label", e.target.value)}
          placeholder="Rótulo"
        />
        <Textarea
          value={node.description || ""}
          onChange={(e) => handle("description", e.target.value)}
          placeholder="Descrição"
        />
      </div>
    </Card>
  );
};
export default NodePropertiesPanel;
