build: lint test

lint:
	deno lint

test:
	deno test -A --coverage=cov_profile
	deno coverage cov_profile
	deno coverage cov_profile --lcov --output=cov_profile.lcov
	genhtml -o cov_profile/html cov_profile.lcov

