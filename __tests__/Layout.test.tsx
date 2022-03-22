import { mount, ReactWrapper } from "enzyme";
import Layout from "../src/layout/Home";
import { Provider } from "react-redux";
import { store } from "../src/store/ConfigureStore";
import { act } from "@testing-library/react";

describe("Layout", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  const waitForComponentToPaint = async (wrapper: ReactWrapper) => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
  };

  test("Layout exists", async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Layout />
      </Provider>
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find(".layout").exists()).toBeTruthy();
  });
});
