build: lint test

lint:
	deno lint --unstable

test:
	deno test -A  --unstable --coverage=cov_profile
	deno coverage cov_profile
	deno coverage cov_profile --lcov --output=cov_profile.lcov
	genhtml -o cov_profile/html cov_profile.lcov

