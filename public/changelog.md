# Changelog

### November 29, 2025: Simplifications

- Removed announcement bar about the database being wiped for summer.
- Removed unpopulated usage analytics charts (no longer being tracked).
  - Might return in the future with a new look.
- Shows the laundry room closest to your floor if you have your building and floor information saved on the homescreen.
- Automatically updates the progressbars and minutes remaining without needing a refresh.

### May 23, 2025: See Closest Laundry Room

- After setting your location, a button appears which directs to the nearest laundry room.
- When in between two floors that contain laundry rooms, the lower floor laundry room is preferred.
  - It is assumed that residents would prefer to walk downstairs rather than upstairs when hauling laundry.

### May 20, 2025: Laying Foundations

- Locations of machines are being stored in a much better format now which will enable many new features:
  - Finding closest laundry rooms to user residence
  - Finding the closest available washer/dryer to user residence
  - Majority of API requests to a database compared to the laundry API
- Each laundry room now has the header as an anchor tag.

### May 19, 2025: Average Usage Charts Reset

- Charts with average usage have been reset to accomodate changing schedules through summer housing.
- Please allow a few weeks for data to be collected and normalize.
- Charts will be reset again in the fall.
