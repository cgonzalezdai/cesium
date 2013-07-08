/*global define*/
define([
        'Core/BoundingRectangle',
        'Scene/CreditDisplay',
        'Scene/FrameState'
    ], function(
        BoundingRectangle,
        CreditDisplay,
        FrameState) {
    "use strict";

    function pick(context, frameState, primitives, x, y) {
        var rectangle = new BoundingRectangle(x, y, 1, 1);
        var pickFramebuffer = context.createPickFramebuffer();
        var passState = pickFramebuffer.begin(rectangle);

        var oldPasses = frameState.passes;
        frameState.passes = (new FrameState(new CreditDisplay(undefined, undefined, context.getCanvas()))).passes;
        frameState.passes.pick = true;

        var commandLists = [];
        primitives.update(context, frameState, commandLists);

        var length = commandLists.length;
        for (var i = 0; i < length; ++i) {
            var commandList = commandLists[i].pickList;
            var commandListLength = commandList.length;
            for (var j = 0; j < commandListLength; ++j) {
                var command = commandList[j];
                command.execute(context, passState);
            }
        }

        frameState.passes = oldPasses;

        var primitive = pickFramebuffer.end(rectangle);
        pickFramebuffer.destroy();

        return primitive;
    }

    return pick;
});