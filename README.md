# Currencee: number transitions

I wanted to check out the new View Transitions API and also brain-dump an interaction idea I had 😅

A demonstration of two approaches to animating currency value changes using Vue.js.

With the View Transitions API it's more straightforward to geat nice transitions, but by going traditional, you get more fine-grained control and complex animation sequences.

I'm excited about the future of view transitions and how it can simplify a lot of the code.

## Two approaches

### View Transitions API 
A newer browser API that simplifies transitions:
- Declarative transitions using CSS and minimal JavaScript
- Browser handles the transition between states
- Simpler implementation for specific use cases

Limited Availability, 84.7% global. Firefox doesn't support it yet.

### Classic Vue transitions
The traditional approach using Vue's transition components:
- Works in all browsers
- More control over animation details
- Effective for complex, multi-stage animations
- Requires more explicit state management
