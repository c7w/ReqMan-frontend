// 这个页面做我们的介绍 以及项目的介绍 还有我们的更新日志
import Home from "../../layout/Home";

const About = () => {
  // 是不是要引用 Home.tsx???
  return (
    <Home sidebar={false}>
      <div>这个页面做"关于我们"</div>
    </Home>
  );
};

export default About;
