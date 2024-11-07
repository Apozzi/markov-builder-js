export type Locale = 'en' | 'pt';

export const messages: Record<Locale, {
  add_vertex: string;
  add_edge: string;
  graphics: string;
  clear: string;
  open: string;
  save: string;
  examples: string;
  graph_layout_and_organization: string;
  graph_layout: string;
  details: string;
  about: string;
  circular_layout: string;
  radial_layout: string;
  tree_layout: string;
  grid_layout: string;
  spectral_layout: string;
  fruchterman_reingold: string;
  kamada_kawai: string;
  transition_matrix: string;
  custom_sounds: string;
  configurations: string;
  periodic_example: string;
  counter_example: string;
  two_communication_classes_example: string;
  two_classes_with_small_jump_example: string;
  apply_to_graph: string;
  delete_last_vertex: string;
  vertex_visit_count: string;
  show_sound_info: string;
  save_configurations: string;
  apply_configurations: string;
  vertex_musical_note: string;
  speed: string;
  tree_layout_warning: string;
  invert_axis: string;
  apply_tree_layout: string;
  tree_layout_configurations: string;
  select_root_vertex: string;
  apply_radial_layout: string;
  no_vertices_added: string;
  vertex: string;
  musical_note: string;
  custom_sound: string;
  vertex_header: string;
  edge_header: string;
  custom_sound_header: string;
  configurations_header: string;
  developed_by: string;
  all_rights_reserved: string;
  contact: string;
  radial_layout_config: string;
  select_language: string;
}> = {
  'en': {
    add_vertex: "Add Vertex",
    add_edge: "Add Edge",
    graphics: 'Plots',
    clear: "Clear",
    open: "Open",
    save: "Save",
    examples: "Examples",
    graph_layout_and_organization: "Graph Layout",
    graph_layout: "Graph Layout",
    details: "Details",
    about: "About",
    circular_layout: "Circular Layout",
    radial_layout: "Radial Layout",
    tree_layout: "Tree Layout",
    grid_layout: "Grid Layout",
    spectral_layout: "Spectral Layout",
    fruchterman_reingold: "Fruchterman-Reingold Algorithm",
    kamada_kawai: "Kamada-Kawai Algorithm",
    transition_matrix: "Transition Matrix",
    custom_sounds: "Custom Sounds",
    configurations: "Configurations",
    periodic_example: "Periodic",
    counter_example: "Counter",
    two_communication_classes_example: "Two Communication Classes",
    two_classes_with_small_jump_example: "Two Classes with Small Jump",
    apply_to_graph: "Apply to Graph",
    delete_last_vertex: "Delete Last Vertex",
    vertex_visit_count: "Vertex Visit Count",
    show_sound_info: "Show Sound Info (UI)",
    save_configurations: "Save Configurations",
    apply_configurations: "Apply Configurations",
    vertex_musical_note: "Vertex Musical Note",
    speed: "Speed",
    tree_layout_warning: "Note: The layout might appear chaotic if there are cycles in the graph.",
    invert_axis: "Invert Axis",
    apply_tree_layout: "Apply Tree Layout",
    tree_layout_configurations: "Tree Layout Configurations",
    select_root_vertex: "Select Root Vertex:",
    apply_radial_layout: "Apply Radial Layout",
    no_vertices_added: "No vertices added.",
    vertex: "Vertex",
    musical_note: "Musical Note",
    custom_sound: "Custom Sound",
    vertex_header: "Vertex",
    edge_header: "Edges",
    custom_sound_header: "Custom Sound Configuration",
    configurations_header: "Settings",
    developed_by: "Developed by:",
    all_rights_reserved: "All rights reserved.",
    contact: "Contact:",
    radial_layout_config: "Radial Layout Configuration",
    select_language: "Select Language: "
  },
  'pt': {
    add_vertex: "Adicionar Vértice",
    add_edge: "Adicionar Aresta",
    graphics: "Gráficos",
    clear: "Limpar",
    open: "Abrir",
    save: "Salvar",
    examples: "Exemplos",
    graph_layout_and_organization: "Layout / Organização do Grafo",
    graph_layout: "Layout do Grafo",
    details: "Detalhes",
    about: "Sobre",
    circular_layout: "Layout Circular",
    radial_layout: "Layout Radial",
    tree_layout: "Layout de Árvore",
    grid_layout: "Layout de Grade",
    spectral_layout: "Layout de Espectro",
    fruchterman_reingold: "Algoritmo de Fruchterman-Reingold",
    kamada_kawai: "Algoritmo de Kamada-Kawai",
    transition_matrix: "Matriz de Transição",
    custom_sounds: "Customização de Sons",
    configurations: "Configurações",
    periodic_example: "Periódico",
    counter_example: "Contador",
    two_communication_classes_example: "Duas classes de Sem Comunicação",
    two_classes_with_small_jump_example: "Duas classes com Pulo",
    apply_to_graph: "Aplicar no Grafo",
    delete_last_vertex: "Deletar Último Vértice",
    vertex_visit_count: "Quant. de vezes que passou nesse vértice",
    show_sound_info: "Mostrar informações de Som (Na interface UI)",
    save_configurations: "Salvar Configurações",
    apply_configurations: "Aplicar Configurações",
    vertex_musical_note: "Nota Musical da Vertice",
    speed: "Velocidade",
    tree_layout_warning: "Obs.: O layout pode ficar caótico caso haja algum ciclo dentro do grafo.",
    invert_axis: "Inverter Eixo",
    apply_tree_layout: "Aplicar Layout de Árvore",
    tree_layout_configurations: "Configurações Layout de Árvore",
    select_root_vertex: "Selecione o Vértice Raiz:",
    apply_radial_layout: "Aplicar Layout Radial",
    no_vertices_added: "Nenhum vértice adicionado.",
    vertex: "Vértice",
    musical_note: "Nota Musical",
    custom_sound: "Som Customizado",
    vertex_header: "Vértice",
    edge_header: "Arestas",
    custom_sound_header: "Customização de Sons",
    configurations_header: "Configurações",
    developed_by: "Desenvolvido por:",
    all_rights_reserved: "Todos os direitos reservados.",
    contact: "Contato:",
    radial_layout_config: "Configurações Layout de Radial",
    select_language: "Selecionar Linguagem: "
  }
};