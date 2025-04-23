# Cart and Dashboard Fixes for TutorTrend

## Current Issues

### 1. Cart Badge Not Displaying

When adding courses to the cart, the cart count badge (small number showing items in cart) is not appearing in the navigation bar.

**Root Causes:**
- The cart context is correctly updating the count, but the UI component in the navbar might not be properly styled or positioned
- The badge element might be missing z-index or proper positioning
- CSS issues with the badge visibility

### 2. User Dashboard Not Updating After Purchase

After purchasing courses, they don't appear in the user dashboard.

**Root Causes:**
- Missing connection between orders and user's purchased courses
- No mechanism to update user's enrolled courses after purchase
- Dashboard might not be querying the correct data

## Solutions

### 1. Fix Cart Badge Display

1. **Verify Cart Context Implementation:**
   - Ensure the cart context is properly updating the count
   - Check that the navbar component is correctly consuming the context

2. **Fix Badge Styling:**
   - Ensure proper z-index
   - Correct positioning (absolute positioning relative to the cart icon)
   - Appropriate visibility settings

3. **Improve Badge Reactivity:**
   - Make sure the badge updates immediately after cart changes

### 2. Update User Dashboard After Purchase

1. **Create Enrollment Records:**
   - After successful order creation, create enrollment records linking users to purchased courses
   - This should happen in the webhook handler

2. **Dashboard Query Updates:**
   - Update dashboard queries to fetch courses from both:
     - Direct enrollments
     - Courses purchased through orders

3. **Data Model Adjustments:**
   - Add an "enrollments" or "userCourses" table if not already present
   - Create relationships between users, courses, and orders

## Implementation Plan

1. Fix the cart badge display issue first (UI/styling fix)
2. Implement the enrollment creation logic in the webhook handler
3. Update the dashboard queries to show purchased courses
4. Test the complete flow from purchase to dashboard display

## Additional Considerations

- Add progress tracking for enrolled courses
- Implement course access control based on purchase status
- Add course completion certificates
- Consider adding a "My Courses" section in the navbar for quick access
