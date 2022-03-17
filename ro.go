package fw

import (
	"regexp"
	"strings"
)

func (h *httpHandler) getRouteKey(incomingMethod string, incomingPath string) string {
	for _, r := range h.routes {
		if incomingMethod == r.method && h.validate(r.path, incomingPath) {
			return r.method + splitter + r.path
		}
	}
	return notFound
}


func (h *httpHandler) validate(path string, incoming string) bool {
	p := split(path)
	i := split(incoming)
	if len(p) != len(i) {
		return false
	}
	return parsePath(p, i)
}

func split(str string) []string {
	var s []string
	s = strings.Split(str, slash)
	s = append(s[:0], s[1:]...)
	return s
}

func isAllTrue(a []bool) bool {
	for i := 0; i < len(a); i++ {
		if !a[i] {
			return false
		}
	}
	return true
}

func parsePath(p []string, incoming []string) (valid bool) {
	var results []bool
	for idx, path := range p {
		results = append(results, isValidPath(idx, path, incoming))
	}
	valid = isAllTrue(results)
	return
}

func isValidPath(idx int, path string, incoming []string) bool {
	if incoming[idx] == path || regex(incoming[idx], path) {
		return true
	}
	return false
}

func regex(incoming string, path string) bool {
	if (incoming != empty) && strings.Contains(path, splitter) {
		if strings.Contains(path, "(") && strings.Contains(path, ")") {
			r := regexp.MustCompile(getPattern(path))
			return r.MatchString(incoming)
		}
		return true
	}
	return false
}

func getPattern(s string) (str string) {
	i := strings.Index(s, "(")
	if i >= 0 {
		j := strings.Index(s, ")")
		if j >= 0 {
			str = s[i+1 : j]
		}
	}
	return
}