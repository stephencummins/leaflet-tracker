# Plan: West Leigh Street Data + Zone Map Views

## Part 1: Impact of Adding West Leigh Street Data

### Current state
The production DB has West Leigh zones (WAZ/WOZ, WPZ, WQZ, WRZ, WSZ) with **69 streets** seeded from rough estimates. Many have bundled names (e.g. "Canvey Road / Ray Walk / Ray Close") and approximate house counts. None have been delivered yet.

### What Chris's data changes
Chris provides precise, canonical street lists for 5 zones (WAZ/WOZ combined into one list of 15 streets). The migration would:

| Zone | Current streets | New streets | Houses (new) |
|------|----------------|-------------|-------------|
| WRZ  | 13             | 12          | 689         |
| WSZ  | 15             | 15          | 924         |
| WQZ  | 13             | 10          | 662         |
| WPZ  | 17             | 8           | 569         |
| WAZ/WOZ | 8           | 15          | 1,088       |

**Total: ~60 new canonical streets replacing ~66 seed streets, ~3,932 houses**

### Migration approach
- DELETE all existing West Leigh streets (no deliveries to preserve)
- INSERT Chris's canonical list with correct names and house counts
- Handle WAZ/WOZ: Chris lists them together — need to decide if they stay as 2 zones or merge to 1
- Regenerate boundaries after geocoding new streets

### Risk: Low
No deliveries recorded for West Leigh yet, so it's a clean replacement. No cascade issues.

### Geocoding requirement
New streets need lat/lng coordinates for the map. Either:
- Manual geocoding via Google/Nominatim API (as done for Leigh streets)
- Or defer map features until geocoded

---

## Part 2: Add Zone-Specific Map to ZoneView

### Current UI
- **ZoneView** (`client/src/pages/ZoneView.jsx`): Text-only list of streets with progress bar and filter tabs
- **MapView** (`client/src/pages/MapView.jsx`): Separate full-screen map showing all zones

### Proposal
Add a small interactive map at the top of ZoneView showing just that zone's boundary and street markers. This helps volunteers understand which area they're covering.

### Implementation

**Files to modify:**
1. `client/src/pages/ZoneView.jsx` — Add `<ZoneMiniMap>` component between the progress bar and filter tabs
2. `client/src/stores/useTrackerStore.js` — Already has `boundaries` and `mapStreets` in state; no changes needed
3. New: `client/src/components/zone/ZoneMiniMap.jsx` — Small Leaflet map component

**ZoneMiniMap component:**
- ~80 lines of code
- Renders a `<MapContainer>` (height ~200px) with:
  - The zone's boundary polygon from `boundaries.zones` (filtered by zone ID)
  - CircleMarkers for streets in this zone (from `activeZone.streets` filtered to those with lat/lng)
  - Green = complete, zone color = incomplete
  - Auto-fits bounds to the zone boundary
- Uses existing `loadBoundaries()` and `loadMapStreets()` from the store
- No new API endpoints needed

**Effort: Small** — ~1-2 hours. All data and dependencies (react-leaflet, boundaries) already exist.

### Considerations
- West Leigh streets won't appear on the mini-map until they're geocoded
- The mini-map should be collapsible (toggle button) so it doesn't dominate mobile screens
- Could reuse the same tile layer and styling from MapView

---

## Recommended Order
1. Write West Leigh street data migration SQL
2. Apply migration + geocode new streets
3. Regenerate boundaries
4. Add ZoneMiniMap component to ZoneView
5. Test with both Leigh (geocoded) and West Leigh zones
