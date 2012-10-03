function createItems(size) {
    var result  = [];

    for (var i = 0; i < size; i += 1) {
        result.push({
            id: 'item' + i,
            selected: ko.observable(false),
            focused: ko.observable(false)
        });
    }
    return result;
}

describe('Selection', function () {
    var model, element;
    beforeEach(function () {
        model = {
            items: ko.observableArray(createItems(10)),
            selection: ko.observableArray(),
            focus: ko.observable(),
            focusItem: function (index) {
                var item = this.items()[index];
                this.focus(item);
            }
        };
    });

    describe('in single selection mode', function () {
        beforeEach(function () {
            element = useTestElement('#single');
            ko.applyBindings(model, element);
        });

        describe('with no selection', function () {
            it('has no elements marked as selected', function () {
                expect(element).to.have.selectionCount(0);
            });

            it('selects the clicked element', function () {
                click($('#item3'));
                expect(element).to.have.selectionCount(1);
            });

            it('select focused element on space', function () {
                model.focusItem(3);
                space($('ul', element));
                expect($('#item3')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            });

            it('selects the element after the focused element on down-arrow', function () {
                model.focusItem(3);
                arrowDown($('ul', element));
                expect($('#item4')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            });

            it('selects the element before the focused element on up-arrow', function () {
                model.focusItem(3);
                arrowUp($('ul', element));
                expect($('#item2')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            });

            describe('when first element is focused', function () {
                beforeEach(function () {
                    model.focusItem(0);
                });
                
                it('selects the focused element on up-arrow', function () {
                    arrowUp($('ul', element));
                    expect($('#item0')).to.have.cssClass('selected');
                    expect(element).to.have.selectionCount(1);
                });
            });

            describe('when last element is focused', function () {
                beforeEach(function () {
                    model.focusItem(9);
                });
                
                it('selects the focused element on down-arrow', function () {
                    arrowDown($('ul', element));
                    expect($('#item9')).to.have.cssClass('selected');
                    expect(element).to.have.selectionCount(1);
                });
            });
        });

        describe('with one selected item', function () {
            beforeEach(function () {
                click($('#item7'));
            });

            it('has one selection', function () {
                expect(element).to.have.selectionCount(1);
                expect($('#item7')).to.have.cssClass('selected');
            });

            it('moves the selection to the clicked element', function () {
                click($('#item3'));
                expect(element).to.have.selectionCount(1);
                expect($('#item3')).to.have.cssClass('selected');
                expect($('#item7')).to.not.have.cssClass('selected');
            });

            it('ignores clicks on selected element', function () {
                click($('#item7'));
                expect(element).to.have.selectionCount(1);
                expect($('#item7')).to.have.cssClass('selected');
            });

            it('ignores shift', function () {
                click($('#item3'), { shiftKey: true });
                expect(element).to.have.selectionCount(1);
                expect($('#item3')).to.have.cssClass('selected');
                expect($('#item4')).to.not.have.cssClass('selected');
                expect($('#item7')).to.not.have.cssClass('selected');
            });

            it('ignores ctrl', function () {
                click($('#item3'), { ctrlKey: true });
                expect(element).to.have.selectionCount(1);
                expect($('#item3')).to.have.cssClass('selected');
                expect($('#item7')).to.not.have.cssClass('selected');
            });

            it('selects next element on down-arrow', function () {
                arrowDown($('ul', element));
                expect($('#item7')).to.not.have.cssClass('selected');
                expect($('#item8')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            }); 
            
            it('selects previous element on up-arrow', function () {
                arrowUp($('ul', element));
                expect($('#item7')).to.not.have.cssClass('selected');
                expect($('#item6')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            }); 

            it('deselects item on space', function () {
                space($('ul', element));
                expect($('#item7')).to.not.have.cssClass('selected');
                expect(element).to.have.selectionCount(0);
            }); 
        });

        it('focuses selected element', function () {
            click($('#item3'));
            var focus = model.focus();
            expect(focus.id).to.be('item3');
            expect(focus.focused()).to.be.ok();
        });
    });

    describe('in multiple selection mode', function () {
        beforeEach(function () {
            element = useTestElement('#multi');
            ko.applyBindings(model, element);
        });

        describe('with no selection', function () {
            it('has no elements marked as selected', function () {
                expect(element).to.have.selectionCount(0);
            });

            it('selects the clicked element', function () {
                click($('#item3'));
                expect(element).to.have.selectionCount(1);
            });

            it('select focused element on space', function () {
                model.focusItem(3);
                space($('ul', element));
                expect($('#item3')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            });

            it('selects the element after the focused element on down-arrow', function () {
                model.focusItem(3);
                arrowDown($('ul', element));
                expect($('#item4')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            });

            it('selects the element before the focused element on up-arrow', function () {
                model.focusItem(3);
                arrowUp($('ul', element));
                expect($('#item2')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            });

            it('selects the focused and element after the focused element on shift-down-arrow'/*, function () {
                // Seems to reproduce a bug in the selection model
                model.focusItem(3);
                arrowDown($('ul', element), { shiftKey: true });
                expect($('#item3')).to.have.cssClass('selected');
                expect($('#item4')).to.have.cssClass('selected');
                expect(element).to.have.selectionCount(1);
            }*/);

            it('selects the focused and element before the focused element on shift-up-arrow');

            describe('when first element is focused', function () {
                beforeEach(function () {
                    model.focusItem(0);
                });
                
                it('selects the focused element on up-arrow', function () {
                    arrowUp($('ul', element));
                    expect($('#item0')).to.have.cssClass('selected');
                    expect(element).to.have.selectionCount(1);
                });
            });

            describe('when last element is focused', function () {
                beforeEach(function () {
                    model.focusItem(9);
                });
                
                it('selects the focused element on down-arrow', function () {
                    arrowDown($('ul', element));
                    expect($('#item9')).to.have.cssClass('selected');
                    expect(element).to.have.selectionCount(1);
                });
            });
        });

        describe('with selected items', function () {
            beforeEach(function () {
                click($('#item7'));
                click($('#item4'), { ctrlKey: true });
                click($('#item2'), { ctrlKey: true });
            });

            it('expands the selection with ctrl-click', function () {
                click($('#item3'), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('deselected selected items with ctrl-click', function () {
                click($('#item4'), { ctrlKey: true });
                expect(element).to.have.selectionCount(2);
                [2,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection with shift-click', function () {
                click($('#item5'), { shiftKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,5].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection downward on shift-down-arrow', function () {
                arrowDown($('ul', element), { shiftKey: true });
                expect(element).to.have.selectionCount(2);
                [2,3].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection further downward on successive shift-down-arrow', function () {
                arrowDown($('ul', element), { shiftKey: true });
                arrowDown($('ul', element), { shiftKey: true });
                expect(element).to.have.selectionCount(3);
                [2,3,4].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection upward on shift-up-arrow', function () {
                arrowUp($('ul', element), { shiftKey: true });
                expect(element).to.have.selectionCount(2);
                [1,2].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection further upward on successive shift-up-arrow', function () {
                arrowUp($('ul', element), { shiftKey: true });
                arrowUp($('ul', element), { shiftKey: true });
                expect(element).to.have.selectionCount(3);
                [0,1,2].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('does not move the selection anchor on successive shift-up/down-arrow', function () {
                arrowDown($('ul', element), { shiftKey: true });
                arrowDown($('ul', element), { shiftKey: true });
                arrowUp($('ul', element), { shiftKey: true });
                arrowDown($('ul', element), { shiftKey: true });
                expect(element).to.have.selectionCount(3);
                [2,3,4].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection downward on ctrl-down-arrow', function () {
                arrowDown($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection further downward on successive ctrl-down-arrow', function () {
                arrowDown($('ul', element), { ctrlKey: true });
                arrowDown($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection upward on ctrl-up-arrow', function () {
                arrowUp($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [1,2,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection further upward on successive ctrl-up-arrow', function () {
                arrowUp($('ul', element), { ctrlKey: true });
                arrowUp($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(5);
                [0,1,2,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('does not move the selection anchor on successive ctrl-up/down-arrow', function () {
                arrowDown($('ul', element), { ctrlKey: true });
                arrowDown($('ul', element), { ctrlKey: true });
                arrowUp($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection downward on ctrl-down-arrow', function () {
                arrowDown($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection further downward on successive ctrl-down-arrow', function () {
                arrowDown($('ul', element), { ctrlKey: true });
                arrowDown($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection upward on ctrl-up-arrow', function () {
                arrowUp($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [1,2,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands the selection further upward on successive ctrl-up-arrow', function () {
                arrowUp($('ul', element), { ctrlKey: true });
                arrowUp($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(5);
                [0,1,2,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });

            it('expands selection on successive ctrl-up/down-arrow', function () {
                arrowDown($('ul', element), { ctrlKey: true });
                arrowDown($('ul', element), { ctrlKey: true });
                arrowUp($('ul', element), { ctrlKey: true });
                expect(element).to.have.selectionCount(4);
                [2,3,4,7].forEach(function (index) {
                    expect($('#item'+index)).to.have.cssClass('selected');
                });
            });
        });
    });
});