beforeEach(() => {
    jasmine.addMatchers({
        toDeepEqual: function(util, customEqualityTesters) {
            return {
                compare: function(actual, expected) {
                    return {
                        pass: JSON.stringify(actual) == JSON.stringify(expected)
                    };
                }
            }
        }
    })
});
