<template>
    <div id="lFow">

    </div>
</template>
<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";

export default {
    data() {
        return {
        };
    },

    mounted() {
        const lf = new LogicFlow({
            container: document.querySelector("#lFow"),
            grid: true,
        });

        lf.render({
            nodes: [
                {
                    id: "1",
                    type: "rect",
                    x: 100,
                    y: 100,
                    text: "节点1",
                },
                {
                    id: "2",
                    type: "circle",
                    x: 300,
                    y: 200,
                    text: "节点2",
                },
            ],
            edges: [
                {
                    sourceNodeId: "1",
                    targetNodeId: "2",
                    type: "polyline",
                    text: "连线",
                },
            ],
        });
    },
};
</script>
<style lang="scss" scoped>
    #lFow{
        height:100vh;
    }
</style>
