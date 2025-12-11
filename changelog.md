# 27/07/2024

- Removed Home page as default landing page made My Tasks as home page instead
- Re added questions.
- Is cash or is Ro added
- Added Temp VehicleDetails Page

# 29/07/2024

- Added vehicle sumamry in vehicle details
- Camera flash added

# 01/08/2024

- Added Multiple Camera image capture options along with their options/modals/questions
- Added One more screen as discussed with @Neeraj Dave between valuate page and vehicle details named VehicleInspection

# 02/08/2024

- Modified Vehicle Details screen from table view to Input And select data format
- Removed VehicleInspection page as it is not needed anymore `VehicleInspection page to be deprecated`

# 07/09/2024

- Login presistance
- Removing bug related to build process failing
- Dashboard UI Change
- Dashboard API integration
- Dashboard Call option enabled
- Dashboard filtering added
- My Tasks API Integration
- - TO GET : some data from My Tasks & Leads in progress page data

# 08/09/2024

- API Integration in completed Leads
- API Integration in qc completed Leads
- API Integration in qc hold Leads
- API Integration in qc Leads
- Create Leads Pincode and phone number change
- Create Leads Dashboard Navigation
- My Tasks Page Icons change for vehicle Types

# 10/09/2024

- Create Leads API integration for vehicle Types
- Create leads passing proper parameters to API
- Fixing missing dependency in meeting
- LeadListStatusWise API related Changes
- Getting missing dependencies

# 22/09/2024

- Force refetch dashboard api
- vehicle details manufacturer date bug + toast before every selection if invalid
- added landing page to load settings and navigation
- create leads yard name bug fix + yard name will go to api in case of repo case

# 23/09/2024

- Metting took place from 10PM to 12PM
- CarMMV called insted of DropDownListType
- Bug on page vehicle details where if we search from bottomsheet it was not closing bottomsheet, instead it was opening it again

# 24/09/2024

- Validations for Create Leads
- Validations for VehicleDetails API call
- Pass parameter in LeadReportDataCreateEdit named LeadStatus to change status of lead
- Re-add validations in ValuationPage to not allow to go to next stage

# 24/09/2024

- Removed sending wrong api status in LeadReportDataCreateEdit
- Modal answer selections fix
- fetch vahan in vehicle details fix

# 25/09/2024

- Send valid base64 to server, image which is stored in localstorage
- duplicate input issue???

# 27/09/2024

- Added api call for valuation page
- Changed npm scripts to update/publish main branch

# 28/09/2024

- Enabled Templates for all types of vehicles
- Enabled Questions for all types of vehicles

# 29/09/2024

- Enabled Templates for all types of vehicles
- Enabled Questions for all types of vehicles

# 30/09/2024

- Enabled Templates for all types of vehicles
- Enabled Questions for all types of vehicles
- Added optional info record option in valuate page
- Mapping for vehicle images upload and vehicle questions upload in valuation screen updated

# 01/10/2024

- Changed mapping for all types

# 02/10/2024

- Changed mapping for questions and images
- Changed Validations for create leads
- Added toast message after successfull lead creation which will now show Registration id

# 03/10/2024

- Re add validations to image clicks and next button on valuate page
- Removed console logs on prod
- Added validation that only mandatory images should get captured optional images should not be mandatory
- Create lead bug fix where user was unable to create lead for repo case but was able to create lead for other types such as cando and retail

# 04/10/2024

- Debug app

# 05/10/2024

- R&D on how to make app click images faster
- Removed image manipulation from app
- Rethink and change logic for "Next" button in valuate lead page
- Send MMV to leadCreateedit (change from sandeep side, changed parameters)
- Added Feature to reject lead with remark
- Integrated API calls - LeadStatusChange and LeadRemarkList
- APK build for prod

# 06/10/2024

- Changed logic for refetch api call for LeadListStatusWise
- Profile photo upload feature added

# 07/10/2024

- Added Video feature
- Added SQLite DB to store video data, it will
  - delete video if user did not submit video
  - Delete video if user recaptured video
  - Add video url if user submits video
- Validation for video has been added unless and until video is captured image capturing is not allowed

# 08/10/2024

- Debugged issue of white screen on certain old devices -- it was related to custom camera compression post processing -- fixed
- Logout feature added -- user wont be able to logout if he has not valuated vehicle's all sides. -- will be able to logout if he has valuated vehicle's all sides
- Clearing data after logout

# 12/10/2024

- Added Share functionality

# 13/10/2024

- Added video upload feature
- Firebase config added

# 14/10/2024

- Added Geolocation after image click
- Updated timing for video duration
- Added Sqlite db to keep track of images/video upload status for particular lead DB:->upload_status
- Sqlite db is not used currently since tomorrow is production

# 16/10/2024

- Added video feature
- Video will now get uploaded to server instead of firebase
- Restrict user till video is uploaded
- Autofocus on video camera is added
- Removed firebase config
- Readded validations on valuate

# 17/10/2024

- Search on myTasks page added
- Video recording pop navigation fixed (it was not happening)
- Only first image was getting captured other were not getting saved
- Added scroll option in QCCompletedLeads, QCHoldLeads, QCLeads, ValuatedLeads, ValuationCompletedLeads, LeadsInProgress

# 20/10/2024

- Added Counters at top of valuation completed leads

# 21/10/2024

- Added Change password Screen -- API integration pending -- no api received
- Fixed bug where after opening keyboard views were overlapping

# 28/01/2025

- Architecture change for image upload
- Bulk image upload on Next btn click of valuation page
- Fixed bulk upload of "upload again" in valuated page

# 24/02/2025

- Keep awake on camera pages

# 09/03/2025

- Removed Dev code
- Fixed bug: it was taking time to proceess after image click for side which has no questions

## TO CHANGE

in QCHoldLeads Page LeadRemark added temporarily

# 28/04/2025

- Resolved the bug encountered during video capturing.
- Visual feedback has been added to the Proceed and Submit buttons.
- Loading logic has been implemented when capturing a picture.
- Minor code optimizations and bug fixes have been made.
