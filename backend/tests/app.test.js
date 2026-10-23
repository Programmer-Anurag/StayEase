import test from "node:test";
import assert from "node:assert/strict";
import { listingSchema, reviewschema } from "../schema.js";
import { expressError } from "../utils/expressError.js";
import { wrapAsync } from "../utils/wrapAsync.js";

test("listingSchema validates correct listing data", () => {
    const validListing = {
        listing: {
            title: "Cozy Mountain Cottage",
            description: "A lovely cottage nestled in the Himalayas.",
            location: "Manali",
            country: "India",
            price: 4500,
            image: "https://example.com/image.jpg"
        }
    };
    const { error } = listingSchema.validate(validListing);
    assert.equal(error, undefined, "Valid listing should not produce validation errors");
});

test("listingSchema rejects missing required fields", () => {
    const invalidListing = {
        listing: {
            title: "Incomplete Listing"
            // missing description, location, country, price
        }
    };
    const { error } = listingSchema.validate(invalidListing);
    assert.ok(error, "Missing fields should produce validation error");
});

test("reviewschema enforces 1 to 5 rating range", () => {
    const validReview = {
        review: {
            rating: 5,
            comment: "Exceptional hospitality!"
        }
    };
    const { error: validError } = reviewschema.validate(validReview);
    assert.equal(validError, undefined);

    const outOfRangeReview = {
        review: {
            rating: 6,
            comment: "Rating too high!"
        }
    };
    const { error: invalidError } = reviewschema.validate(outOfRangeReview);
    assert.ok(invalidError, "Rating greater than 5 should fail validation");
});

test("expressError initializes statusCode and errorMessage correctly", () => {
    const err = new expressError(404, "Page not found");
    assert.equal(err.statusCode, 404);
    assert.equal(err.errorMessage, "Page not found");
    assert.ok(err instanceof Error);
});

test("wrapAsync catches rejected promises and routes to next(err)", async () => {
    const expectedError = new Error("Async failure");
    const failingAsyncFn = async () => {
        throw expectedError;
    };

    let capturedError = null;
    const wrapped = wrapAsync(failingAsyncFn);
    
    await new Promise((resolve) => {
        const next = (err) => {
            capturedError = err;
            resolve();
        };
        wrapped({}, {}, next);
    });

    assert.equal(capturedError, expectedError);
});
