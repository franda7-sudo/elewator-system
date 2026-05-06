import React from "react";
import { useParams } from "react-router-dom";
import GrainGroups from "../../../components/Admin/grains/GrainGroups";
import "./Grains.css";

export default function GrainDetails() {
  const { grainId } = useParams();
  return (
    <div className="grains-container">
      <h1>Grupa jakości — {grainId}</h1>
      <GrainGroups grainId={grainId} />
    </div>
  );
}
