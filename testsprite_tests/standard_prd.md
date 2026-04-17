# Product Requirements Document
**Project:** Ethereum Ecosystem Galaxy
**Version:** 1.0

## Overview
An interactive WebGL 3D visualization platform containing over 1,700 projects in the Ethereum ecosystem space. Users can browse the universe of projects categorized across multiple dynamic orbits.

## Key Features
1. **3D WebGL Canvas Rendering:** Renders 1,700+ projects via InstancedMesh for high performance.
2. **Theming Engine:** Supports "Dark Mode" and "Ethereum Silk Mode" (`#F0F2F9` background, high contrast).
3. **Interactive Raycasting:** Hovering over an orb automatically slides in an informational ProjectDetailPanel containing metadata.
4. **Search & Filter Overlay:** Users can locate specific projects or filter by tags via the UI Overlay.

## Non-Functional Requirements
- **Performance:** MUST maintain at least 45-60 FPS under full geometry load.
- **UI Avoidance:** The layout MUST ensure the Detail Panel and Search Overlay do not clip or overlap heavily on 1080p displays.
