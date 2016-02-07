import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    memberships: { deserialize: 'links', serialize: false }, //save employees with company
    awards: { deserialize: 'links', serialize: false },
    projects: { deserialize: 'links', serialize: false }, //ids, false, records, links
  }
});
