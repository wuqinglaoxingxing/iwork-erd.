<template>
    <div class="home">
        <div class="header">
            <div class="logo"></div>
            <div class="links">
                <div class="link free">Free</div>
                <div class="link about">About</div>
            </div>
        </div>
        <div class="container">
            <div class="left">
                <div class="introduce">
                    <div class="title">
                        Start To Make Database model
                    </div>
                    <div class="description">
                        极简易用数据库建模过程精细提炼,
                        化繁为简,
                        省去不必要的操作,
                        只留下最需要的,
                        直截了当的展现给用户。
                        自带案例自带参考案例,
                        以耳熟能详的[学生信息管理]为原型参考,
                        让用户能够快速了解[iwork-ERD]
                    </div>
                    <input class="toMain" type="button" value="Start" @click='toMain'>
                </div>
            </div>
            <div class="right"></div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        toMain() {
            this.$router.push({ path: "/main" });
        },
    },
};
</script>

<style  lang="scss" scoped>
.home {
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(
        to bottom,
        #114ba3,
        #306dbc,
        #528fd3,
        #76b1e8,
        #9fd4fd
    );

    display: flex;
    flex-direction: column;
    & > .header {
        width: 100vw;
        height: 0.6rem;
        border-bottom: 1px #ccc solid;
        display: flex;
        & > .logo {
            background-image: url(../asset/desc.png);
            background-repeat: no-repeat;
            background-size: cover;
            width: 2rem;
            height: 100%;
        }
        & > .links {
            flex: 1;
            display: inline-flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-right: .1rem;
            font-size: 14px;;
            &>.link{
                color: #fff;
                width: 1rem;
                text-align: center;
                cursor: pointer;
            }
            &>.about{

            }
            
            &>.free{
                background:#8fc721;
                border-radius:15px;
                height:.3rem;
                line-height: .3rem;
                
            }
        }
    }

    & > .container {
        flex: 1;
        display: flex;
        flex-direction: row;
        & > .left {
            width: 50%;
            height: 100%;
            position: relative;
            & > .introduce {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50%;

                & > .title {
                    color: #fff;
                    font-weight: bolder;
                    font-size: 28px;
                }

                & > .description {
                    margin-top: 0.2rem;
                    color: #fff;
                    font-size: 14px;
                    line-height: 0.22rem;
                }

                & > .toMain {
                    margin-top: 0.3rem;
                    width: 1rem;
                    height: 0.4rem;
                    background: transparent;
                    border: 1px solid #fff;
                    border-radius: 15px;
                    color: #fff;
                }
            }
        }
        & > .right {
            width: 50%;
            height: 100%;
            background-position: center;
            background-repeat:no-repeat;
            background-size:contain;
            background-image: url(../asset/web-development.png);
        }
    }
}
</style>
