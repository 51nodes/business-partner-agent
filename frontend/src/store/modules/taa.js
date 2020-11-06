import { EventBus, axios, apiBaseUrl } from "../../main";

const state = {
  taaRequired: false,
  taaText: "No Transaction Author Agreement loaded",
  taaDigest: "",
  taaVersion: String,
};

const getters = {
  taaRequired: (state) => {
    return state.taaRequired;
  },
  taaText: (state) => {
    return state.taaText;
  },
  taaVersion: (state) => {
    return state.taaVersion;
  },
};

const mutations = {
  setTaa(state, payload) {
    if (payload) {
      state.taaText = payload.taa.text;
      state.taaDigest = payload.taa.digest;
      state.taaVersion = payload.taa.version;
    }
  },
  setTaaRequired(state, payload) {
    state.taaRequired = payload.taaRequired;
  },
};

const actions = {
  validateTaa({ commit, dispatch }) {
    axios
      .get(`${apiBaseUrl}/admin/endpoints/registrationRequired`)
      .then((result) => {
        const required = result.data;
        if (required) {
          dispatch("getTaa");
        }
        commit({ type: "setTaaRequired", taaRequired: required });
      })
      .catch((e) => {
        console.error(e);
        EventBus.$emit("error", e);
      });
  },

  getTaa({ commit }) {
    axios
      .get(`${apiBaseUrl}/admin/taa/get`)
      .then((result) => {
        commit({ type: "setTaa", taa: result.data });
      })
      .catch((e) => {
        console.error(e);
        EventBus.$emit("error", e);
      });
  },

  registerTaa({ dispatch }) {
    axios
      .post(`${apiBaseUrl}/admin/endpoints/register`, {
        digest: state.taaDigest,
      })
      .then(() => {
        dispatch("validateTaa");
        EventBus.$emit("success", "Success");
      })
      .catch((e) => {
        console.error(e);
        EventBus.$emit("error", e);
      });
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
